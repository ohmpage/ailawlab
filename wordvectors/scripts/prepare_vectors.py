#!/usr/bin/env python3
"""
Convert word vector files to the compact binary format used by the demo.

Supported input formats:
  --format glove     (default) GloVe text format: one "word f1 f2 ... fn" per line
  --format word2vec  word2vec binary format (Google News, etc.)

Usage — GloVe:
  python3 scripts/prepare_vectors.py --input glove.6B.50d.txt --words 100000 --outdir data/glove

Usage — Google News word2vec (download GoogleNews-vectors-negative300.bin.gz first):
  python3 scripts/prepare_vectors.py \\
      --input GoogleNews-vectors-negative300.bin \\
      --format word2vec --words 200000 --outdir data/googlenews

Outputs (in --outdir):
  vocab.json   — {"word": index, ...}  for O(1) lookup in JS
  vectors.bin  — 8-byte header [uint32 num_words, uint32 dim] then raw float32 matrix
"""

import argparse
import json
import struct
import sys
from pathlib import Path


def load_glove(path, max_words):
    """Read GloVe text format. Returns (words, vecs, dim)."""
    words, vecs, dim = [], [], None
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i >= max_words:
                break
            parts = line.rstrip().split(" ")
            word = parts[0]
            vals = list(map(float, parts[1:]))
            if dim is None:
                dim = len(vals)
            words.append(word)
            vecs.append(vals)
            if (i + 1) % 10_000 == 0:
                print(f"  {i + 1:,} words …")
    return words, vecs, dim


def load_word2vec(path, max_words):
    """Read word2vec binary format (e.g. Google News).

    Format:
      - Text header line: "<num_words> <dim>\\n"
      - For each word: word bytes terminated by space, then dim * float32 bytes
    All words are lowercased; first occurrence wins on collision.
    """
    words, vecs, dim = [], [], None
    seen = set()

    with open(path, "rb") as f:
        header = f.readline().decode("utf-8").strip()
        total_words, dim = map(int, header.split())
        limit = min(max_words, total_words)
        print(f"  Header: {total_words:,} words, dim={dim} (reading first {limit:,})")

        for i in range(limit):
            # Read word bytes until space
            word_bytes = bytearray()
            while True:
                ch = f.read(1)
                if not ch or ch == b" ":
                    break
                if ch == b"\n":
                    continue  # skip leading newline present in some files
                word_bytes += ch

            # Read float32 vector
            raw = f.read(dim * 4)
            if len(raw) < dim * 4:
                print(f"  Warning: truncated file at word {i + 1:,}")
                break

            # Some implementations write a trailing newline after each vector
            pos = f.tell()
            ch = f.read(1)
            if ch != b"\n":
                f.seek(pos)

            word = word_bytes.decode("utf-8", errors="ignore").lower()
            if word in seen:
                continue  # keep first occurrence after lowercasing
            seen.add(word)

            vecs.append(list(struct.unpack(f"<{dim}f", raw)))
            words.append(word)

            if (i + 1) % 10_000 == 0:
                print(f"  {i + 1:,} words …")

    return words, vecs, dim


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True,
                        help="Path to input vectors file")
    parser.add_argument("--format", choices=["glove", "word2vec"], default="glove",
                        help="Input format (default: glove)")
    parser.add_argument("--words", type=int, default=100_000,
                        help="Number of words to include (most frequent first)")
    parser.add_argument("--outdir", default="data/glove",
                        help="Output directory (created if absent)")
    args = parser.parse_args()

    inpath = Path(args.input)
    if not inpath.exists():
        sys.exit(f"Error: {inpath} not found.")

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    print(f"Reading {inpath} (format={args.format}) …")
    if args.format == "glove":
        words, vecs, dim = load_glove(inpath, args.words)
    else:
        words, vecs, dim = load_word2vec(inpath, args.words)

    n = len(words)
    print(f"Loaded {n:,} words, dim={dim}")

    # vocab.json — word → index
    vocab_path = outdir / "vocab.json"
    vocab = {word: i for i, word in enumerate(words)}
    with open(vocab_path, "w") as f:
        json.dump(vocab, f, separators=(",", ":"))
    print(f"Wrote {vocab_path}  ({vocab_path.stat().st_size / 1e6:.1f} MB)")

    # vectors.bin — 8-byte header then float32 matrix, row-major
    vec_path = outdir / "vectors.bin"
    with open(vec_path, "wb") as f:
        f.write(struct.pack("<II", n, dim))
        for vec in vecs:
            f.write(struct.pack(f"<{dim}f", *vec))
    print(f"Wrote {vec_path}  ({vec_path.stat().st_size / 1e6:.1f} MB)")
    print("Done.")


if __name__ == "__main__":
    main()
