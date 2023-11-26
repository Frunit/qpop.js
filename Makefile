.PHONY : all pack copy build watch prod

all:
	pack copy prod

copy:
	cp -u assets/favicon.ico assets/index.html build
	#cp -u assets/static/* build/assets

pack:
	python3 build_tools/texture_packer.py

build:
	bun build src/index.ts --outdir build

watch:
	bun build src/index.ts --outdir build --watch

prod:
	bun build src/index.ts --outdir build --minimize
