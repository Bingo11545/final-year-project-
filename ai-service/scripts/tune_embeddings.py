"""
Simple tuning harness for embeddings and similarity thresholds.
Usage: python scripts/tune_embeddings.py --dir path/to/images
The script will call the local `generate-embedding` endpoint for images and compute pairwise similarities.
"""
import os
import sys
import argparse
import requests
import json
import itertools

BACKEND = os.environ.get('AI_SERVICE_URL', 'http://127.0.0.1:5001')


def get_embedding(path):
    url = BACKEND.rstrip('/') + '/generate-embedding'
    with open(path, 'rb') as f:
        files = {'image': (os.path.basename(path), f, 'image/jpeg')}
        r = requests.post(url, files=files, timeout=30)
        r.raise_for_status()
        data = r.json()
        return data.get('embedding'), data.get('model')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dir', required=True, help='Directory of images to use for tuning')
    p.add_argument('--out', default='tuning_results.json', help='Output JSON file')
    args = p.parse_args()

    files = [os.path.join(args.dir, f) for f in os.listdir(args.dir) if f.lower().endswith(('.jpg','.jpeg','.png'))]
    print(f'Found {len(files)} images')
    embeddings = {}
    models = {}
    for fp in files:
        try:
            emb, model = get_embedding(fp)
            if emb:
                embeddings[fp] = emb
                models[fp] = model
                print('Embedded:', fp, 'via', model)
        except Exception as e:
            print('Failed to embed', fp, e)

    results = []
    for (a, emb_a), (b, emb_b) in itertools.combinations(embeddings.items(), 2):
        # compute cosine
        import math
        def cosine(x,y):
            ax = [float(v) for v in x]
            bx = [float(v) for v in y]
            da = math.sqrt(sum(v*v for v in ax))
            db = math.sqrt(sum(v*v for v in bx))
            if da==0 or db==0:
                return 0.0
            dot = sum(ax[i]*bx[i] for i in range(min(len(ax), len(bx))))
            return dot/(da*db)
        sim = cosine(emb_a, emb_b)
        results.append({ 'a': a, 'b': b, 'similarity': sim, 'model_a': models.get(a), 'model_b': models.get(b) })

    # simple stats
    thresholds = [0.80, 0.85, 0.90, 0.92]
    stats = {str(t): sum(1 for r in results if r['similarity'] >= t) for t in thresholds}
    out = { 'count_images': len(embeddings), 'pairs': len(results), 'stats': stats, 'results': results }
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2)
    print('Wrote', args.out)


if __name__ == '__main__':
    main()
