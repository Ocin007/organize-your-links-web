@echo off
cd ../.. && composer install && npm install && npm run webpack && cd src/scripts && php prepare-data-dir.php && php combine-all-js-to-one.php && pause