#!/bin/sh
if [[ -z ${ENV} ]]; then
 export ENV="Accep"
 echo "ENV is not set, will use default Acceptance environment"
else
  export ENV="${ENV}"
  echo "Environment is set to $ENV"
fi
npm run clean

# UI functional tests

npx playwright test test_name --workers=1

#generate final report and combine it in one html file
echo \"⌚ Saving the allure report\" && npx allure generate --clean && node ./node_modules/allure-single-html-file-js/combine.js ./allure-report && echo \"⌚ Allure report saved in allure-report folder\"

