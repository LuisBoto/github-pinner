(function() {
  var types = {
    PROFILE : 0,
    REPO : 1,
    ALL : 2
  }

  // MARK: - Main
  function init() {
    var origin = document.getElementsByClassName("github-pinner")
    if (origin[0] == null) throw new Error('GitHub Planner: Could not find GitHub Pinner HTML element. Do you have the right \'id\' set on the element?')
    loadCSS()

    for (i = 0; i < origin.length; i++) {
      loadElements(origin[i])
    }
  }

  function loadElements(parent, filter = "") {
    var values = parseUrl(parent.getAttribute("data"))
    getDataForUrl(values["URL"], values["TYPE"], parent, function(obj, type, element) {
      // set up DOM elements
      if (type == types["PROFILE"]) {
          var temp = "<div id=\"gp-container-profile\"><a href=\"" + obj.html_url + "\">"
          if (obj.bio.length < 45) temp += "<img id='gp-avatar' style=\"width: 60px;\" src=\"" + obj.avatar_url + "\"></a><div id='gp-information'><a class='gp-link' href=\"" + obj.html_url + "\"><span class=\"gp-element gp-name\">" + obj.name + "</span><span class=\"gp-element gp-user\">" + obj.login + "</span></a><span class=\"gp-element gp-bio\">" + obj.bio + "</span></div><div class='gp-stats'><a class=\"gp-stat\" href=\"" + obj.html_url + "?tab=repositories" + "\"><b class=\"gp-stat-val\">" + obj.public_repos + "</b><span class=\"gp-stat-desc\">Repos</span></a><a class=\"gp-stat\" href=\"" + obj.html_url + "?tab=followers" + "\"><b class=\"gp-stat-val\">" + obj.followers + "</b><span class=\"gp-stat-desc\">Followers</span></a><a class=\"gp-stat\" href=\"" + obj.html_url + "?tab=following" + "\"><b class=\"gp-stat-val\">" + obj.following + "</b><span class=\"gp-stat-desc\">Following</span></a><a href=\"" + obj.html_url + "\" class=\"gp-btn gp-follow\">Follow</a></div></div>"
          else temp += "<img id='gp-avatar' style=\"width: 80px;\" src=\"" + obj.avatar_url + "\"></a><div id='gp-information'><a class='gp-link' href=\"" + obj.html_url + "\"><span class=\"gp-element gp-name\">" + obj.name + "</span><span class=\"gp-element gp-user\">" + obj.login + "</span></a><span class=\"gp-element gp-bio\">" + obj.bio + "</span></div><div class='gp-stats'><a class=\"gp-stat\" href=\"" + obj.html_url + "?tab=repositories" + "\"><b class=\"gp-stat-val\">" + obj.public_repos + "</b><span class=\"gp-stat-desc\">Repos</span></a><a class=\"gp-stat\" href=\"" + obj.html_url + "?tab=followers" + "\"><b class=\"gp-stat-val\">" + obj.followers + "</b><span class=\"gp-stat-desc\">Followers</span></a><a class=\"gp-stat\" href=\"" + obj.html_url + "?tab=following" + "\"><b class=\"gp-stat-val\">" + obj.following + "</b><span class=\"gp-stat-desc\">Following</span></a><a href=\"" + obj.html_url + "\" class=\"gp-btn gp-follow\">Follow</a></div></div>"
          if (element.classList.contains("flat")) {
            element.className = "github-pinner flat gp-profile"
          } else {
            element.className = "github-pinner gp-profile"
          }
          element.innerHTML = temp
      } else if (type == types["REPO"]) {
          var temp = getRepo(obj)
          if (element.classList.contains("flat")) {
            element.className = "github-pinner flat gp-repo"
          } else {
            element.className = "github-pinner gp-repo"
          }
          element.innerHTML = temp
      } else if (type == types["ALL"]) {
          if (element.classList.contains("flat")) {
            element.className = "github-pinner flat gp-all"
          } else {
            element.className = "github-pinner gp-all"
          }
          if (filter != "") {
            var child = element.querySelector("#gp-container-all-repos")
            var temp = ""
            for (j = 0; j < obj.length; j++) {
              if (filter == "" || obj[j].name.toLowerCase().indexOf(filter.toLowerCase()) != -1) {
                temp += getRepo(obj[j])
              }
            }
            child.innerHTML = temp
          } else {
            var temp = "<input size=\"30\" type=\"text\" placeholder=\"Search for project...\" value=\"" + filter + "\" class=\"gp-search\"></input><div id=\"gp-container-all-repos\">"
            for (j = 0; j < obj.length; j++) {
                temp += getRepo(obj[j])
            }
            temp += "</div>"
            element.innerHTML = temp
            var searchs = document.getElementsByClassName("gp-search")
            for (j = 0; j < searchs.length; j++) {
              searchs[j].addEventListener("keyup", search);
            }
          }
      }
      element.style.visibility = "visible"
    })
  }

  function search(e) {
    loadElements(e.path[1], e.target.value)
  }

  function getRepo(obj) {
    var temp = "<div id=\"gp-container-repo\"><a class=\"gp-title\" href=\"" + obj.html_url + "\">" + obj.name + "</a><p class=\"gp-desc\">" + (obj.description || '') + "</p><div id=\"gp-stats\">"
    if (obj.language != "" && lang_colors[obj.language] != null) temp += "<p class=\"gp-stat\"><span class=\"gp-lang\" style=\"background-color: " + lang_colors[obj.language]["color"] + ";\"></span>" + obj.language + "</p>"
    if (obj.stargazers_count != 0) temp += "<a class=\"gp-stat gp-link\" href=\"" + obj.html_url + "/stargazers" + "\"><svg class=\"gp-octicon\" height=\"16\" role=\"img\" version=\"1.1\" viewBox=\"0 0 14 16\" width=\"14\"><path fill-rule=\"evenodd\" d=\"M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z\"></path></svg>" + obj.stargazers_count + "</a>"
    if (obj.forks != 0) temp += "<a class=\"gp-stat gp-link\" href=\"" + obj.html_url + "/network" + "\"><svg class=\"gp-octicon\" height=\"16\" role=\"img\" version=\"1.1\" viewBox=\"0 0 10 16\" width=\"10\"><path fill-rule=\"evenodd\" d=\"M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z\"></path></svg>" + obj.forks + "</a>"
    temp += "</div></div>"
    return temp
  }

  function loadCSS() {
    var styleref = document.createElement("link")
    styleref.rel = "stylesheet"
    styleref.type = "text/css"
    styleref.href = "https://luisboto.github.io/github-pinner/css/style.css" // "https://d29mk5socxaj4o.cloudfront.net/css/style.css"
    document.getElementsByTagName("head")[0].prepend(styleref)
  }

  function getDataForUrl(url, type, element, completion) {
    var handler = new APIHandler(url)
    handler.load(function(response) {
      objs = JSON.parse(response)
      completion(objs, type, element)
    })
  }

  // MARK: - API Handler
  function APIHandler(url, items=4) {
    // initializations
    self.url = url
    self.items = items
  }

  APIHandler.prototype.load = function(callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText)
    }
    request.open("GET", self.url, true );
    request.send( null );
  }

  // MARK: - Helper Functions
  function parseUrl(url) {
    profile = /^(http|https):\/\/(www.)?github.com(\/)?\/[A-Za-z\d-]{1,39}(\/)?$/;
    repository = /^(http|https):\/\/(www.)?github.com\/[A-Za-z\d-]{1,39}\/[A-Za-z\d-]{1,100}(\/)?$/;
    repositories = /^(http|https):\/\/(www.)?github.com\/[A-Za-z\d-]{1,39}\?tab=repositories(\/)?$/;
    if (profile.test(url)) {
      // profile
      var profileName = url.replace(/^(http|https):\/\/(www.)?github.com(\/)?/g, "").replace(/\/$/, "")
      return {"URL": "https://api.github.com/users/" + profileName, "TYPE" : types["PROFILE"] }
    } else if (repository.test(url)) {
      // repository
      var profileName = url.replace(/^(http|https):\/\/(www.)?github.com(\/)?/g, "").replace(/\/.*(\/)?$/, "")
      var repositoryName = url.replace(/^(http|https):\/\/(www.)?github.com\/[A-Za-z\d-]{1,39}\//g, "").replace(/\/$/, "")
      return {"URL" : "https://api.github.com/repos/" + profileName + "/" + repositoryName, "TYPE": types["REPO"] }
    } else if (repositories.test(url)) {
      // repositories
      var profileName = url.replace(/^(http|https):\/\/(www.)?github.com\//, "").replace(/\?tab=repositories(\/)?$/, "")
      return {"URL" : "https://api.github.com/users/" + profileName + "/repos", "TYPE" : types["ALL"] }
    } else {
      throw new Error('GitHub Planner: Invalid data parameter! Unrecognized GitHub URl: ' + url)
    }
  }

  document.addEventListener("DOMContentLoaded", function(event){
    init()
  })

  /* Thanks to - https://github.com/ozh/github-colors */
  var lang_colors = {"1CEnterprise":{"color":"#814CCC","url":"https://github.com/trending?l=1C-Enterprise"},"ABAP":{"color":"#E8274B","url":"https://github.com/trending?l=ABAP"},"ActionScript":{"color":"#882B0F","url":"https://github.com/trending?l=ActionScript"},"Ada":{"color":"#02f88c","url":"https://github.com/trending?l=Ada"},"Agda":{"color":"#315665","url":"https://github.com/trending?l=Agda"},"AGSScript":{"color":"#B9D9FF","url":"https://github.com/trending?l=AGS-Script"},"Alloy":{"color":"#64C800","url":"https://github.com/trending?l=Alloy"},"AlpineAbuild":{"color":null,"url":"https://github.com/trending?l=Alpine-Abuild"},"AMPL":{"color":"#E6EFBB","url":"https://github.com/trending?l=AMPL"},"ANTLR":{"color":"#9DC3FF","url":"https://github.com/trending?l=ANTLR"},"Apex":{"color":null,"url":"https://github.com/trending?l=Apex"},"APIBlueprint":{"color":"#2ACCA8","url":"https://github.com/trending?l=API-Blueprint"},"APL":{"color":"#5A8164","url":"https://github.com/trending?l=APL"},"ApolloGuidanceComputer":{"color":null,"url":"https://github.com/trending?l=Apollo-Guidance-Computer"},"AppleScript":{"color":"#101F1F","url":"https://github.com/trending?l=AppleScript"},"Arc":{"color":"#aa2afe","url":"https://github.com/trending?l=Arc"},"Arduino":{"color":"#bd79d1","url":"https://github.com/trending?l=Arduino"},"ASP":{"color":"#6a40fd","url":"https://github.com/trending?l=ASP"},"AspectJ":{"color":"#a957b0","url":"https://github.com/trending?l=AspectJ"},"Assembly":{"color":"#6E4C13","url":"https://github.com/trending?l=Assembly"},"ATS":{"color":"#1ac620","url":"https://github.com/trending?l=ATS"},"Augeas":{"color":null,"url":"https://github.com/trending?l=Augeas"},"AutoHotkey":{"color":"#6594b9","url":"https://github.com/trending?l=AutoHotkey"},"AutoIt":{"color":"#1C3552","url":"https://github.com/trending?l=AutoIt"},"Awk":{"color":null,"url":"https://github.com/trending?l=Awk"},"Ballerina":{"color":"#FF5000","url":"https://github.com/trending?l=Ballerina"},"Batchfile":{"color":"#C1F12E","url":"https://github.com/trending?l=Batchfile"},"Befunge":{"color":null,"url":"https://github.com/trending?l=Befunge"},"Bison":{"color":null,"url":"https://github.com/trending?l=Bison"},"BitBake":{"color":null,"url":"https://github.com/trending?l=BitBake"},"BlitzBasic":{"color":null,"url":"https://github.com/trending?l=BlitzBasic"},"BlitzMax":{"color":"#cd6400","url":"https://github.com/trending?l=BlitzMax"},"Bluespec":{"color":null,"url":"https://github.com/trending?l=Bluespec"},"Boo":{"color":"#d4bec1","url":"https://github.com/trending?l=Boo"},"Brainfuck":{"color":"#2F2530","url":"https://github.com/trending?l=Brainfuck"},"Brightscript":{"color":null,"url":"https://github.com/trending?l=Brightscript"},"Bro":{"color":null,"url":"https://github.com/trending?l=Bro"},"C":{"color":"#555555","url":"https://github.com/trending?l=C"},"C#":{"color":"#178600","url":"https://github.com/trending?l=Csharp"},"C++":{"color":"#f34b7d","url":"https://github.com/trending?l=C++"},"C2hsHaskell":{"color":null,"url":"https://github.com/trending?l=C2hs-Haskell"},"Cap'nProto":{"color":null,"url":"https://github.com/trending?l=Cap'n-Proto"},"CartoCSS":{"color":null,"url":"https://github.com/trending?l=CartoCSS"},"Ceylon":{"color":"#dfa535","url":"https://github.com/trending?l=Ceylon"},"Chapel":{"color":"#8dc63f","url":"https://github.com/trending?l=Chapel"},"Charity":{"color":null,"url":"https://github.com/trending?l=Charity"},"ChucK":{"color":null,"url":"https://github.com/trending?l=ChucK"},"Cirru":{"color":"#ccccff","url":"https://github.com/trending?l=Cirru"},"Clarion":{"color":"#db901e","url":"https://github.com/trending?l=Clarion"},"Clean":{"color":"#3F85AF","url":"https://github.com/trending?l=Clean"},"Click":{"color":"#E4E6F3","url":"https://github.com/trending?l=Click"},"CLIPS":{"color":null,"url":"https://github.com/trending?l=CLIPS"},"Clojure":{"color":"#db5855","url":"https://github.com/trending?l=Clojure"},"CMake":{"color":null,"url":"https://github.com/trending?l=CMake"},"COBOL":{"color":null,"url":"https://github.com/trending?l=COBOL"},"CoffeeScript":{"color":"#244776","url":"https://github.com/trending?l=CoffeeScript"},"ColdFusion":{"color":"#ed2cd6","url":"https://github.com/trending?l=ColdFusion"},"ColdFusionCFC":{"color":null,"url":"https://github.com/trending?l=ColdFusion-CFC"},"CommonLisp":{"color":"#3fb68b","url":"https://github.com/trending?l=Common-Lisp"},"ComponentPascal":{"color":"#B0CE4E","url":"https://github.com/trending?l=Component-Pascal"},"Cool":{"color":null,"url":"https://github.com/trending?l=Cool"},"Coq":{"color":null,"url":"https://github.com/trending?l=Coq"},"Crystal":{"color":"#776791","url":"https://github.com/trending?l=Crystal"},"Csound":{"color":null,"url":"https://github.com/trending?l=Csound"},"CsoundDocument":{"color":null,"url":"https://github.com/trending?l=Csound-Document"},"CsoundScore":{"color":null,"url":"https://github.com/trending?l=Csound-Score"},"CSS":{"color":"#563d7c","url":"https://github.com/trending?l=CSS"},"Cuda":{"color":"#3A4E3A","url":"https://github.com/trending?l=Cuda"},"CWeb":{"color":null,"url":"https://github.com/trending?l=CWeb"},"Cycript":{"color":null,"url":"https://github.com/trending?l=Cycript"},"Cython":{"color":null,"url":"https://github.com/trending?l=Cython"},"D":{"color":"#ba595e","url":"https://github.com/trending?l=D"},"Dart":{"color":"#00B4AB","url":"https://github.com/trending?l=Dart"},"DataWeave":{"color":"#003a52","url":"https://github.com/trending?l=DataWeave"},"DIGITALCommandLanguage":{"color":null,"url":"https://github.com/trending?l=DIGITAL-Command-Language"},"DM":{"color":"#447265","url":"https://github.com/trending?l=DM"},"Dogescript":{"color":"#cca760","url":"https://github.com/trending?l=Dogescript"},"DTrace":{"color":null,"url":"https://github.com/trending?l=DTrace"},"Dylan":{"color":"#6c616e","url":"https://github.com/trending?l=Dylan"},"E":{"color":"#ccce35","url":"https://github.com/trending?l=E"},"eC":{"color":"#913960","url":"https://github.com/trending?l=eC"},"ECL":{"color":"#8a1267","url":"https://github.com/trending?l=ECL"},"ECLiPSe":{"color":null,"url":"https://github.com/trending?l=ECLiPSe"},"Eiffel":{"color":"#946d57","url":"https://github.com/trending?l=Eiffel"},"Elixir":{"color":"#6e4a7e","url":"https://github.com/trending?l=Elixir"},"Elm":{"color":"#60B5CC","url":"https://github.com/trending?l=Elm"},"EmacsLisp":{"color":"#c065db","url":"https://github.com/trending?l=Emacs-Lisp"},"EmberScript":{"color":"#FFF4F3","url":"https://github.com/trending?l=EmberScript"},"EQ":{"color":"#a78649","url":"https://github.com/trending?l=EQ"},"Erlang":{"color":"#B83998","url":"https://github.com/trending?l=Erlang"},"F#":{"color":"#b845fc","url":"https://github.com/trending?l=Fsharp"},"Factor":{"color":"#636746","url":"https://github.com/trending?l=Factor"},"Fancy":{"color":"#7b9db4","url":"https://github.com/trending?l=Fancy"},"Fantom":{"color":"#14253c","url":"https://github.com/trending?l=Fantom"},"FilebenchWML":{"color":null,"url":"https://github.com/trending?l=Filebench-WML"},"Filterscript":{"color":null,"url":"https://github.com/trending?l=Filterscript"},"fish":{"color":null,"url":"https://github.com/trending?l=fish"},"FLUX":{"color":"#88ccff","url":"https://github.com/trending?l=FLUX"},"Forth":{"color":"#341708","url":"https://github.com/trending?l=Forth"},"Fortran":{"color":"#4d41b1","url":"https://github.com/trending?l=Fortran"},"FreeMarker":{"color":"#0050b2","url":"https://github.com/trending?l=FreeMarker"},"Frege":{"color":"#00cafe","url":"https://github.com/trending?l=Frege"},"GameMakerLanguage":{"color":"#8fb200","url":"https://github.com/trending?l=Game-Maker-Language"},"GAMS":{"color":null,"url":"https://github.com/trending?l=GAMS"},"GAP":{"color":null,"url":"https://github.com/trending?l=GAP"},"GCCMachineDescription":{"color":null,"url":"https://github.com/trending?l=GCC-Machine-Description"},"GDB":{"color":null,"url":"https://github.com/trending?l=GDB"},"GDScript":{"color":null,"url":"https://github.com/trending?l=GDScript"},"Genie":{"color":"#fb855d","url":"https://github.com/trending?l=Genie"},"Genshi":{"color":null,"url":"https://github.com/trending?l=Genshi"},"GentooEbuild":{"color":null,"url":"https://github.com/trending?l=Gentoo-Ebuild"},"GentooEclass":{"color":null,"url":"https://github.com/trending?l=Gentoo-Eclass"},"Gherkin":{"color":"#5B2063","url":"https://github.com/trending?l=Gherkin"},"GLSL":{"color":null,"url":"https://github.com/trending?l=GLSL"},"Glyph":{"color":"#e4cc98","url":"https://github.com/trending?l=Glyph"},"Gnuplot":{"color":"#f0a9f0","url":"https://github.com/trending?l=Gnuplot"},"Go":{"color":"#375eab","url":"https://github.com/trending?l=Go"},"Golo":{"color":"#88562A","url":"https://github.com/trending?l=Golo"},"Gosu":{"color":"#82937f","url":"https://github.com/trending?l=Gosu"},"Grace":{"color":null,"url":"https://github.com/trending?l=Grace"},"GrammaticalFramework":{"color":"#79aa7a","url":"https://github.com/trending?l=Grammatical-Framework"},"Groovy":{"color":"#e69f56","url":"https://github.com/trending?l=Groovy"},"GroovyServerPages":{"color":null,"url":"https://github.com/trending?l=Groovy-Server-Pages"},"Hack":{"color":"#878787","url":"https://github.com/trending?l=Hack"},"Harbour":{"color":"#0e60e3","url":"https://github.com/trending?l=Harbour"},"Haskell":{"color":"#5e5086","url":"https://github.com/trending?l=Haskell"},"Haxe":{"color":"#df7900","url":"https://github.com/trending?l=Haxe"},"HCL":{"color":null,"url":"https://github.com/trending?l=HCL"},"HLSL":{"color":null,"url":"https://github.com/trending?l=HLSL"},"HTML":{"color":"#e34c26","url":"https://github.com/trending?l=HTML"},"Hy":{"color":"#7790B2","url":"https://github.com/trending?l=Hy"},"HyPhy":{"color":null,"url":"https://github.com/trending?l=HyPhy"},"IDL":{"color":"#a3522f","url":"https://github.com/trending?l=IDL"},"Idris":{"color":null,"url":"https://github.com/trending?l=Idris"},"IGORPro":{"color":null,"url":"https://github.com/trending?l=IGOR-Pro"},"Inform7":{"color":null,"url":"https://github.com/trending?l=Inform-7"},"InnoSetup":{"color":null,"url":"https://github.com/trending?l=Inno-Setup"},"Io":{"color":"#a9188d","url":"https://github.com/trending?l=Io"},"Ioke":{"color":"#078193","url":"https://github.com/trending?l=Ioke"},"Isabelle":{"color":"#FEFE00","url":"https://github.com/trending?l=Isabelle"},"IsabelleROOT":{"color":null,"url":"https://github.com/trending?l=Isabelle-ROOT"},"J":{"color":"#9EEDFF","url":"https://github.com/trending?l=J"},"Jasmin":{"color":null,"url":"https://github.com/trending?l=Jasmin"},"Java":{"color":"#b07219","url":"https://github.com/trending?l=Java"},"JavaServerPages":{"color":null,"url":"https://github.com/trending?l=Java-Server-Pages"},"JavaScript":{"color":"#f1e05a","url":"https://github.com/trending?l=JavaScript"},"JFlex":{"color":null,"url":"https://github.com/trending?l=JFlex"},"Jison":{"color":null,"url":"https://github.com/trending?l=Jison"},"JisonLex":{"color":null,"url":"https://github.com/trending?l=Jison-Lex"},"Jolie":{"color":"#843179","url":"https://github.com/trending?l=Jolie"},"JSONiq":{"color":"#40d47e","url":"https://github.com/trending?l=JSONiq"},"JSX":{"color":null,"url":"https://github.com/trending?l=JSX"},"Julia":{"color":"#a270ba","url":"https://github.com/trending?l=Julia"},"Jupyter Notebook":{"color":"#DA5B0B","url":"https://github.com/trending?l=Jupyter-Notebook"},"Kotlin":{"color":"#F18E33","url":"https://github.com/trending?l=Kotlin"},"KRL":{"color":"#28431f","url":"https://github.com/trending?l=KRL"},"LabVIEW":{"color":null,"url":"https://github.com/trending?l=LabVIEW"},"Lasso":{"color":"#999999","url":"https://github.com/trending?l=Lasso"},"Lean":{"color":null,"url":"https://github.com/trending?l=Lean"},"Lex":{"color":"#DBCA00","url":"https://github.com/trending?l=Lex"},"LFE":{"color":null,"url":"https://github.com/trending?l=LFE"},"LilyPond":{"color":null,"url":"https://github.com/trending?l=LilyPond"},"Limbo":{"color":null,"url":"https://github.com/trending?l=Limbo"},"LiterateAgda":{"color":null,"url":"https://github.com/trending?l=Literate-Agda"},"LiterateCoffeeScript":{"color":null,"url":"https://github.com/trending?l=Literate-CoffeeScript"},"LiterateHaskell":{"color":null,"url":"https://github.com/trending?l=Literate-Haskell"},"LiveScript":{"color":"#499886","url":"https://github.com/trending?l=LiveScript"},"LLVM":{"color":"#185619","url":"https://github.com/trending?l=LLVM"},"Logos":{"color":null,"url":"https://github.com/trending?l=Logos"},"Logtalk":{"color":null,"url":"https://github.com/trending?l=Logtalk"},"LOLCODE":{"color":"#cc9900","url":"https://github.com/trending?l=LOLCODE"},"LookML":{"color":"#652B81","url":"https://github.com/trending?l=LookML"},"LoomScript":{"color":null,"url":"https://github.com/trending?l=LoomScript"},"LSL":{"color":"#3d9970","url":"https://github.com/trending?l=LSL"},"Lua":{"color":"#000080","url":"https://github.com/trending?l=Lua"},"M":{"color":null,"url":"https://github.com/trending?l=M"},"M4":{"color":null,"url":"https://github.com/trending?l=M4"},"M4Sugar":{"color":null,"url":"https://github.com/trending?l=M4Sugar"},"Makefile":{"color":"#427819","url":"https://github.com/trending?l=Makefile"},"Mako":{"color":null,"url":"https://github.com/trending?l=Mako"},"Mask":{"color":"#f97732","url":"https://github.com/trending?l=Mask"},"Mathematica":{"color":null,"url":"https://github.com/trending?l=Mathematica"},"Matlab":{"color":"#e16737","url":"https://github.com/trending?l=Matlab"},"Max":{"color":"#c4a79c","url":"https://github.com/trending?l=Max"},"MAXScript":{"color":"#00a6a6","url":"https://github.com/trending?l=MAXScript"},"Mercury":{"color":"#ff2b2b","url":"https://github.com/trending?l=Mercury"},"Meson":{"color":"#007800","url":"https://github.com/trending?l=Meson"},"Metal":{"color":"#8f14e9","url":"https://github.com/trending?l=Metal"},"MiniD":{"color":null,"url":"https://github.com/trending?l=MiniD"},"Mirah":{"color":"#c7a938","url":"https://github.com/trending?l=Mirah"},"Modelica":{"color":null,"url":"https://github.com/trending?l=Modelica"},"Modula-2":{"color":null,"url":"https://github.com/trending?l=Modula-2"},"ModuleManagementSystem":{"color":null,"url":"https://github.com/trending?l=Module-Management-System"},"Monkey":{"color":null,"url":"https://github.com/trending?l=Monkey"},"Moocode":{"color":null,"url":"https://github.com/trending?l=Moocode"},"MoonScript":{"color":null,"url":"https://github.com/trending?l=MoonScript"},"MQL4":{"color":"#62A8D6","url":"https://github.com/trending?l=MQL4"},"MQL5":{"color":"#4A76B8","url":"https://github.com/trending?l=MQL5"},"MTML":{"color":"#b7e1f4","url":"https://github.com/trending?l=MTML"},"MUF":{"color":null,"url":"https://github.com/trending?l=MUF"},"mupad":{"color":null,"url":"https://github.com/trending?l=mupad"},"Myghty":{"color":null,"url":"https://github.com/trending?l=Myghty"},"NCL":{"color":"#28431f","url":"https://github.com/trending?l=NCL"},"Nearley":{"color":"#990000","url":"https://github.com/trending?l=Nearley"},"Nemerle":{"color":"#3d3c6e","url":"https://github.com/trending?l=Nemerle"},"nesC":{"color":"#94B0C7","url":"https://github.com/trending?l=nesC"},"NetLinx":{"color":"#0aa0ff","url":"https://github.com/trending?l=NetLinx"},"NetLinx+ERB":{"color":"#747faa","url":"https://github.com/trending?l=NetLinx+ERB"},"NetLogo":{"color":"#ff6375","url":"https://github.com/trending?l=NetLogo"},"NewLisp":{"color":"#87AED7","url":"https://github.com/trending?l=NewLisp"},"Nim":{"color":"#37775b","url":"https://github.com/trending?l=Nim"},"Nit":{"color":"#009917","url":"https://github.com/trending?l=Nit"},"Nix":{"color":"#7e7eff","url":"https://github.com/trending?l=Nix"},"NSIS":{"color":null,"url":"https://github.com/trending?l=NSIS"},"Nu":{"color":"#c9df40","url":"https://github.com/trending?l=Nu"},"NumPy":{"color":null,"url":"https://github.com/trending?l=NumPy"},"Objective-C":{"color":"#438eff","url":"https://github.com/trending?l=Objective-C"},"Objective-C++":{"color":"#6866fb","url":"https://github.com/trending?l=Objective-C++"},"Objective-J":{"color":"#ff0c5a","url":"https://github.com/trending?l=Objective-J"},"OCaml":{"color":"#3be133","url":"https://github.com/trending?l=OCaml"},"Omgrofl":{"color":"#cabbff","url":"https://github.com/trending?l=Omgrofl"},"ooc":{"color":"#b0b77e","url":"https://github.com/trending?l=ooc"},"Opa":{"color":null,"url":"https://github.com/trending?l=Opa"},"Opal":{"color":"#f7ede0","url":"https://github.com/trending?l=Opal"},"OpenCL":{"color":null,"url":"https://github.com/trending?l=OpenCL"},"OpenEdgeABL":{"color":null,"url":"https://github.com/trending?l=OpenEdge-ABL"},"OpenRCrunscript":{"color":null,"url":"https://github.com/trending?l=OpenRC-runscript"},"OpenSCAD":{"color":null,"url":"https://github.com/trending?l=OpenSCAD"},"Ox":{"color":null,"url":"https://github.com/trending?l=Ox"},"Oxygene":{"color":"#cdd0e3","url":"https://github.com/trending?l=Oxygene"},"Oz":{"color":"#fab738","url":"https://github.com/trending?l=Oz"},"P4":{"color":"#7055b5","url":"https://github.com/trending?l=P4"},"Pan":{"color":"#cc0000","url":"https://github.com/trending?l=Pan"},"Papyrus":{"color":"#6600cc","url":"https://github.com/trending?l=Papyrus"},"Parrot":{"color":"#f3ca0a","url":"https://github.com/trending?l=Parrot"},"ParrotAssembly":{"color":null,"url":"https://github.com/trending?l=Parrot-Assembly"},"ParrotInternalRepresentation":{"color":null,"url":"https://github.com/trending?l=Parrot-Internal-Representation"},"Pascal":{"color":"#E3F171","url":"https://github.com/trending?l=Pascal"},"PAWN":{"color":"#dbb284","url":"https://github.com/trending?l=PAWN"},"Pep8":{"color":"#C76F5B","url":"https://github.com/trending?l=Pep8"},"Perl":{"color":"#0298c3","url":"https://github.com/trending?l=Perl"},"Perl6":{"color":"#0000fb","url":"https://github.com/trending?l=Perl-6"},"PHP":{"color":"#4F5D95","url":"https://github.com/trending?l=PHP"},"PicoLisp":{"color":null,"url":"https://github.com/trending?l=PicoLisp"},"PigLatin":{"color":"#fcd7de","url":"https://github.com/trending?l=PigLatin"},"Pike":{"color":"#005390","url":"https://github.com/trending?l=Pike"},"PLpgSQL":{"color":null,"url":"https://github.com/trending?l=PLpgSQL"},"PLSQL":{"color":"#dad8d8","url":"https://github.com/trending?l=PLSQL"},"PogoScript":{"color":"#d80074","url":"https://github.com/trending?l=PogoScript"},"Pony":{"color":null,"url":"https://github.com/trending?l=Pony"},"PostScript":{"color":"#da291c","url":"https://github.com/trending?l=PostScript"},"POV-RaySDL":{"color":null,"url":"https://github.com/trending?l=POV-Ray-SDL"},"PowerBuilder":{"color":"#8f0f8d","url":"https://github.com/trending?l=PowerBuilder"},"PowerShell":{"color":"#012456","url":"https://github.com/trending?l=PowerShell"},"Processing":{"color":"#0096D8","url":"https://github.com/trending?l=Processing"},"Prolog":{"color":"#74283c","url":"https://github.com/trending?l=Prolog"},"PropellerSpin":{"color":"#7fa2a7","url":"https://github.com/trending?l=Propeller-Spin"},"Puppet":{"color":"#302B6D","url":"https://github.com/trending?l=Puppet"},"PureBasic":{"color":"#5a6986","url":"https://github.com/trending?l=PureBasic"},"PureScript":{"color":"#1D222D","url":"https://github.com/trending?l=PureScript"},"Python":{"color":"#3572A5","url":"https://github.com/trending?l=Python"},"Pythonconsole":{"color":null,"url":"https://github.com/trending?l=Python-console"},"QMake":{"color":null,"url":"https://github.com/trending?l=QMake"},"QML":{"color":"#44a51c","url":"https://github.com/trending?l=QML"},"R":{"color":"#198CE7","url":"https://github.com/trending?l=R"},"Racket":{"color":"#22228f","url":"https://github.com/trending?l=Racket"},"Ragel":{"color":"#9d5200","url":"https://github.com/trending?l=Ragel"},"RAML":{"color":"#77d9fb","url":"https://github.com/trending?l=RAML"},"Rascal":{"color":"#fffaa0","url":"https://github.com/trending?l=Rascal"},"REALbasic":{"color":null,"url":"https://github.com/trending?l=REALbasic"},"Reason":{"color":null,"url":"https://github.com/trending?l=Reason"},"Rebol":{"color":"#358a5b","url":"https://github.com/trending?l=Rebol"},"Red":{"color":"#f50000","url":"https://github.com/trending?l=Red"},"Redcode":{"color":null,"url":"https://github.com/trending?l=Redcode"},"Ren'Py":{"color":"#ff7f7f","url":"https://github.com/trending?l=Ren'Py"},"RenderScript":{"color":null,"url":"https://github.com/trending?l=RenderScript"},"REXX":{"color":null,"url":"https://github.com/trending?l=REXX"},"Ring":{"color":"#0e60e3","url":"https://github.com/trending?l=Ring"},"RobotFramework":{"color":null,"url":"https://github.com/trending?l=RobotFramework"},"Roff":{"color":"#ecdebe","url":"https://github.com/trending?l=Roff"},"Rouge":{"color":"#cc0088","url":"https://github.com/trending?l=Rouge"},"Ruby":{"color":"#701516","url":"https://github.com/trending?l=Ruby"},"RUNOFF":{"color":"#665a4e","url":"https://github.com/trending?l=RUNOFF"},"Rust":{"color":"#dea584","url":"https://github.com/trending?l=Rust"},"Sage":{"color":null,"url":"https://github.com/trending?l=Sage"},"SaltStack":{"color":"#646464","url":"https://github.com/trending?l=SaltStack"},"SAS":{"color":"#B34936","url":"https://github.com/trending?l=SAS"},"Scala":{"color":"#c22d40","url":"https://github.com/trending?l=Scala"},"Scheme":{"color":"#1e4aec","url":"https://github.com/trending?l=Scheme"},"Scilab":{"color":null,"url":"https://github.com/trending?l=Scilab"},"Self":{"color":"#0579aa","url":"https://github.com/trending?l=Self"},"ShaderLab":{"color":null,"url":"https://github.com/trending?l=ShaderLab"},"Shell":{"color":"#89e051","url":"https://github.com/trending?l=Shell"},"ShellSession":{"color":null,"url":"https://github.com/trending?l=ShellSession"},"Shen":{"color":"#120F14","url":"https://github.com/trending?l=Shen"},"Slash":{"color":"#007eff","url":"https://github.com/trending?l=Slash"},"Smali":{"color":null,"url":"https://github.com/trending?l=Smali"},"Smalltalk":{"color":"#596706","url":"https://github.com/trending?l=Smalltalk"},"Smarty":{"color":null,"url":"https://github.com/trending?l=Smarty"},"SMT":{"color":null,"url":"https://github.com/trending?l=SMT"},"SourcePawn":{"color":"#5c7611","url":"https://github.com/trending?l=SourcePawn"},"SQF":{"color":"#3F3F3F","url":"https://github.com/trending?l=SQF"},"SQLPL":{"color":null,"url":"https://github.com/trending?l=SQLPL"},"Squirrel":{"color":"#800000","url":"https://github.com/trending?l=Squirrel"},"SRecodeTemplate":{"color":"#348a34","url":"https://github.com/trending?l=SRecode-Template"},"Stan":{"color":"#b2011d","url":"https://github.com/trending?l=Stan"},"StandardML":{"color":"#dc566d","url":"https://github.com/trending?l=Standard-ML"},"Stata":{"color":null,"url":"https://github.com/trending?l=Stata"},"SuperCollider":{"color":"#46390b","url":"https://github.com/trending?l=SuperCollider"},"Swift":{"color":"#ffac45","url":"https://github.com/trending?l=Swift"},"SystemVerilog":{"color":"#DAE1C2","url":"https://github.com/trending?l=SystemVerilog"},"Tcl":{"color":"#e4cc98","url":"https://github.com/trending?l=Tcl"},"Tcsh":{"color":null,"url":"https://github.com/trending?l=Tcsh"},"Terra":{"color":"#00004c","url":"https://github.com/trending?l=Terra"},"TeX":{"color":"#3D6117","url":"https://github.com/trending?l=TeX"},"Thrift":{"color":null,"url":"https://github.com/trending?l=Thrift"},"TIProgram":{"color":"#A0AA87","url":"https://github.com/trending?l=TI-Program"},"TLA":{"color":null,"url":"https://github.com/trending?l=TLA"},"Turing":{"color":"#cf142b","url":"https://github.com/trending?l=Turing"},"TXL":{"color":null,"url":"https://github.com/trending?l=TXL"},"TypeScript":{"color":"#2b7489","url":"https://github.com/trending?l=TypeScript"},"UnifiedParallelC":{"color":null,"url":"https://github.com/trending?l=Unified-Parallel-C"},"UnixAssembly":{"color":null,"url":"https://github.com/trending?l=Unix-Assembly"},"Uno":{"color":null,"url":"https://github.com/trending?l=Uno"},"UnrealScript":{"color":"#a54c4d","url":"https://github.com/trending?l=UnrealScript"},"UrWeb":{"color":null,"url":"https://github.com/trending?l=UrWeb"},"Vala":{"color":"#fbe5cd","url":"https://github.com/trending?l=Vala"},"VCL":{"color":null,"url":"https://github.com/trending?l=VCL"},"Verilog":{"color":"#b2b7f8","url":"https://github.com/trending?l=Verilog"},"VHDL":{"color":"#adb2cb","url":"https://github.com/trending?l=VHDL"},"Vimscript":{"color":"#199f4b","url":"https://github.com/trending?l=Vim-script"},"VisualBasic":{"color":"#945db7","url":"https://github.com/trending?l=Visual-Basic"},"Volt":{"color":"#1F1F1F","url":"https://github.com/trending?l=Volt"},"Vue":{"color":"#2c3e50","url":"https://github.com/trending?l=Vue"},"WebAssembly":{"color":"#04133b","url":"https://github.com/trending?l=WebAssembly"},"WebIDL":{"color":null,"url":"https://github.com/trending?l=WebIDL"},"wisp":{"color":"#7582D1","url":"https://github.com/trending?l=wisp"},"X10":{"color":"#4B6BEF","url":"https://github.com/trending?l=X10"},"xBase":{"color":"#403a40","url":"https://github.com/trending?l=xBase"},"XC":{"color":"#99DA07","url":"https://github.com/trending?l=XC"},"Xojo":{"color":null,"url":"https://github.com/trending?l=Xojo"},"XProc":{"color":null,"url":"https://github.com/trending?l=XProc"},"XQuery":{"color":"#5232e7","url":"https://github.com/trending?l=XQuery"},"XS":{"color":null,"url":"https://github.com/trending?l=XS"},"XSLT":{"color":"#EB8CEB","url":"https://github.com/trending?l=XSLT"},"Xtend":{"color":null,"url":"https://github.com/trending?l=Xtend"},"Yacc":{"color":"#4B6C4B","url":"https://github.com/trending?l=Yacc"},"Zephir":{"color":"#118f9e","url":"https://github.com/trending?l=Zephir"},"Zimpl":{"color":null,"url":"https://github.com/trending?l=Zimpl"}}

}());
