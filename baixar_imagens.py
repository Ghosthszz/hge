#!/usr/bin/env python3
"""Baixa as fotos oficiais listadas no manifest para assets/products/. Execute com Python 3 e internet."""
from pathlib import Path
import json, urllib.request, sys
ROOT=Path(__file__).resolve().parent
manifest=json.loads((ROOT/'assets/products-download-manifest.json').read_text(encoding='utf-8'))
out=ROOT/'assets'/'products'; out.mkdir(parents=True,exist_ok=True)
ok=[]; failed=[]
for item in manifest:
    dest=out/item['filename']
    try:
        req=urllib.request.Request(item['url'],headers={'User-Agent':'Mozilla/5.0 (compatible; HGE-assets-downloader/1.0)'})
        with urllib.request.urlopen(req,timeout=25) as r:
            data=r.read()
            ctype=r.headers.get('Content-Type','')
        if not data or ('image' not in ctype.lower() and not data.startswith((b'\xff\xd8\xff',b'\x89PNG',b'GIF8',b'RIFF',b'<svg'))):
            raise ValueError('resposta não parece ser imagem ('+ctype+')')
        dest.write_bytes(data); ok.append(item['filename']); print('OK',item['filename'])
    except Exception as e:
        failed.append((item['url'],str(e))); print('FALHOU',item['url'],'->',e)
print(f'\nConcluído: {len(ok)} baixadas; {len(failed)} falharam.')
if failed:
    (ROOT/'assets'/'products-download-failures.txt').write_text('\n'.join(u+'\t'+e for u,e in failed),encoding='utf-8')
    sys.exit(1)
