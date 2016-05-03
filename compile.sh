npm run dev-up
npm link
# maybe we need injections for communications
# PRODUCATION
nativefier --name "Redkix" "https://beta.redkix.com/" --icon "assets/Production.icns" --counter --maximize
# STAGING
nativefier --name "Redkix Staging" "https://staging.redkix.com/" --icon "assets/Staging.icns" --counter --maximize
# INTEGRATION
nativefier --name "Redkix Integration" "http://int.redkix.com/" --icon "assets/Integration.icns" --counter --maximize
# NIGHTLY
nativefier --name "Redkix Nightly" "http://nightly.redkix.com/" --icon "assets/Dev.icns" --counter --maximize
# LOCAL
nativefier --name "Redkix localhost" "http://0.0.0.0:9000/" --icon "assets/Dev.icns" --counter --maximize

# MAKE INSTALLERS FOR ALL VERSIONS
dropdmg --config-name=Redkix "Redkix-darwin-x64/Redkix.app"
dropdmg --config-name=Redkix "Redkix Staging-darwin-x64/Redkix Staging.app"
dropdmg --config-name=Redkix "Redkix Integration-darwin-x64/Redkix Integration.app"
dropdmg --config-name=Redkix "Redkix Nightly-darwin-x64/Redkix Nightly.app"
dropdmg --config-name=Redkix "Redkix localhost-darwin-x64/Redkix localhost.app"