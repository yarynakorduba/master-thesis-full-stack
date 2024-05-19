rm -R -f ./migrations &&
pipenv run init &&
dropdb -h localhost -U yaryna.korduba master_thesis || true &&
createdb -h localhost -U yaryna.korduba master_thesis || true &&
psql -h localhost master_thesis -U yaryna.korduba -c 'CREATE EXTENSION unaccent;' || true &&
pipenv run migrate &&
pipenv run upgrade
