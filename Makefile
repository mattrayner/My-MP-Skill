test:
	(cd lambda && npm test)

compile:
	./lambda/node_modules/typescript/bin/tsc -p ./lambda/

dependencies:
	cp ./lambda/package.json ./lambda/dist/
	(cd lambda/dist && npm install --only=production)
	rm ./lambda/dist/package*.json

update-skill:
	ask deploy --target skill -p matt
	ask deploy --target model -p matt

deploy-skill: compile dependencies
	ask deploy -p matt

simulate:
	ask simulate -l en-GB -p matt -t "Alexa, ask My M. P. who they are"
