# This installs two files, app.exe and logo.ico, creates a start menu shortcut, builds an uninstaller, and
# adds uninstall information to the registry for Add/Remove Programs

# To get started, put this script into a folder with the two files (app.exe, logo.ico, and license.rtf -
# You'll have to create these yourself) and run makensis on it

# If you change the names "app.exe", "logo.ico", or "license.rtf" you should do a search and replace - they
# show up in a few places.
# All the other settings can be tweaked by editing the !defines at the top of this script

!include MUI2.nsh

!define APPNAME "Redkix"
!define COMPANYNAME "Redkix"
!define DESCRIPTION "The new outlook on email"
# These three must be integers
!define VERSIONMAJOR 1
!define VERSIONMINOR 1
!define VERSIONBUILD 1
# These will be displayed by the "Click here for support information" link in "Add/Remove Programs"
# It is possible to use "mailto:" links in here to open the email client
!define HELPURL "http://redkix.com" # "Support Information" link
!define UPDATEURL "http://redkix.com" # "Product Updates" link
!define ABOUTURL "http://redkix.com" # "Publisher" link
# This is the size (in kB) of all the files copied into "Program Files"
!define INSTALLSIZE 121000

!define MUI_PAGE_HEADER_TEXT "${APPNAME}"
!define MUI_PAGE_HEADER_SUBTEXT "Desktop App"
!define MUI_DIRECTORYPAGE_TEXT_TOP "RedKix is a new outlook on email that makes it fast, collaborative and actionable. It's real-time messaging, groups && more, optimized for team communication."
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION "Please select where you'd like the app to be installed"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Launch Redkix"
!define MUI_FINISHPAGE_RUN_FUNCTION "StartRedkix"
!insertmacro MUI_PAGE_FINISH

RequestExecutionLevel admin ;Require admin rights on NT6+ (When UAC is turned on)

InstallDir "$PROGRAMFILES\${APPNAME}"

# This will be in the installer/uninstaller's title bar
Name "${APPNAME}"
Icon "logo.ico"
outFile "${APPNAME} Installer.exe"

!include LogicLib.nsh

# Just three pages - license agreement, install location, and installation
# page directory
# Page instfiles


!macro VerifyUserIsAdmin
UserInfo::GetAccountType
pop $0
${If} $0 != "admin" ;Require admin rights on NT4+
        messageBox mb_iconstop "Administrator rights required!"
        setErrorLevel 740 ;ERROR_ELEVATION_REQUIRED
        quit
${EndIf}
!macroend

function .onInit
	setShellVarContext all
	!insertmacro VerifyUserIsAdmin
functionEnd

Function StartRedkix
	ExecShell "" "$INSTDIR\${APPNAME}.exe"
FunctionEnd

section "install"
	# Files for the install directory - to build the installer, these should be in the same directory as the install script (this file)
	setOutPath $INSTDIR
	# Files added here should be removed by the uninstaller (see section "uninstall")
	file "xinput1_3.dll"
	file "content_resources_200_percent.pak"
	file "content_shell.pak"
	file "d3dcompiler_47.dll"
	file "ffmpeg.dll"
	file "icudtl.dat"
	file "libEGL.dll"
	file "libGLESv2.dll"
	file "LICENSE"
	file "LICENSES.chromium.html"
	file "msvcp120.dll"
	file "msvcr120.dll"
	file "natives_blob.bin"
	file "node.dll"
	file "${APPNAME}.exe"
	file "snapshot_blob.bin"
	file "ui_resources_200_percent.pak"
	file "vccorlib120.dll"
	file "version"
	file "logo.ico"

	# copy folders
	SetOutPath $INSTDIR\locales
	File /nonfatal /a /r "locales\" #note back slash at the end
	SetOutPath $INSTDIR\resources
	File /nonfatal /a /r "resources\" #note back slash at the end

	AccessControl::GrantOnFile  "$INSTDIR\resources\" "(S-1-5-32-545)" "FullAccess"

	# Add any other files for the install directory (license files, app data, etc) here

	# Uninstaller - See function un.onInit and section "uninstall" for configuration
	writeUninstaller "$INSTDIR\uninstall.exe"

	# Start Menu
	createDirectory "$SMPROGRAMS\${COMPANYNAME}"
	createShortCut "$SMPROGRAMS\${COMPANYNAME}\${APPNAME}.lnk" "$INSTDIR\${APPNAME}.exe"

	# Desktop Shortuct
	CreateShortcut "$desktop\${APPNAME}.lnk" "$INSTDIR\${APPNAME}.exe"

	# Registry information for add/remove programs
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "DisplayName" "${APPNAME} Desktop App"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "QuietUninstallString" "$\"$INSTDIR\uninstall.exe$\" /S"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "DisplayIcon" "$\"$INSTDIR\logo.ico$\""
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "Publisher" "${COMPANYNAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "HelpLink" "$\"${HELPURL}$\""
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "URLUpdateInfo" "$\"${UPDATEURL}$\""
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "URLInfoAbout" "$\"${ABOUTURL}$\""
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "VersionMinor" ${VERSIONMINOR}
	# There is no option for modifying or repairing the install
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "NoRepair" 1
	# Set the INSTALLSIZE constant (!defined at the top of this script) so Add/Remove Programs can accurately report the size
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "EstimatedSize" ${INSTALLSIZE}
sectionEnd

# Uninstaller

function un.onInit
	SetShellVarContext all

	#Verify the uninstaller - last chance to back out
	MessageBox MB_OKCANCEL "Permanantly remove ${APPNAME}?" IDOK next
		Abort
	next:
	!insertmacro VerifyUserIsAdmin
functionEnd

section "uninstall"

	# Remove Start Menu launcher
	delete "$SMPROGRAMS\${COMPANYNAME}\${APPNAME}.lnk"
	# Try to remove the Start Menu folder - this will only happen if it is empty
	rmDir "$SMPROGRAMS\${COMPANYNAME}"

	# Remove desktop shortcut
	delete "$desktop\${APPNAME}.lnk"

	# Remove files
	delete $INSTDIR\xinput1_3.dll
	delete $INSTDIR\content_resources_200_percent.pak
	delete $INSTDIR\content_shell.pak
	delete $INSTDIR\d3dcompiler_47.dll
	delete $INSTDIR\icudtl.dat
	delete $INSTDIR\libEGL.dll
	delete $INSTDIR\libGLESv2.dll
	delete $INSTDIR\LICENSE
	delete $INSTDIR\LICENSES.chromium.html
	delete $INSTDIR\msvcp120.dll
	delete $INSTDIR\msvcr120.dll
	delete $INSTDIR\ffmpeg.dll
	delete $INSTDIR\natives_blob.bin
	delete $INSTDIR\node.dll
	delete "$INSTDIR\${APPNAME}.exe"
	delete $INSTDIR\snapshot_blob.bin
	delete $INSTDIR\ui_resources_200_percent.pak
	delete $INSTDIR\vccorlib120.dll
	delete $INSTDIR\version
	delete $INSTDIR\logo.ico
	RMDir /r $INSTDIR\locales
	RMDir /r $INSTDIR\resources

	# Always delete uninstaller as the last action
	delete $INSTDIR\uninstall.exe

	# should only work if the folder empty. safer for un-clean installs
	RMDir "$INSTDIR"

	# Remove uninstaller information from the registry
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}"
sectionEnd
