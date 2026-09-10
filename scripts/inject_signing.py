import os, re, pathlib
p = pathlib.Path("android/app/build.gradle")
s = p.read_text()
ks = os.environ["KS_PASS"]
signing = """
    signingConfigs {
        release {
            storeFile file("../../keystore/whatshouldi.keystore")
            storePassword "%s"
            keyAlias "whatshouldi"
            keyPassword "%s"
        }
    }
""" % (ks, ks)
s = s.replace("buildTypes {", signing + "    buildTypes {", 1)
if "signingConfig signingConfigs.release" not in s:
    s2, n = re.subn(r"(buildTypes\s*\{[^{}]*?release\s*\{)",
                    r"\1\n            signingConfig signingConfigs.release", s, count=1, flags=re.S)
    if n == 0:
        raise SystemExit("could not locate buildTypes.release block")
    s = s2
p.write_text(s)
print("signing injected")
