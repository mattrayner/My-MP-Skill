test:
	(cd lambda && npm test)

compile:
	./lambda/node_modules/typescript/bin/tsc -p ./lambda/

dependencies:
	rm -r ./lambda/node_modules
	(cd lambda && npm install --only=production)
	cp -r ./lambda/node_modules ./lambda/dist/
