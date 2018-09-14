//  mg - (MasterGlobal Toolkit)
/*      # JDQE - jQuery Done Quick'n Easy
            #
            #
            #
            #
            #
*/
(function(window){
    function MG(selector){
        const self = {}
        self.selector = selector
        // Set the self element reference variable to the selector reference IF the selector is an object.
        // ELSE set the element reference based on the number of nodes in the nodeList returned from document.querySelectorAll(self.selector)
        if(typeof(self.selector) === 'object') self.el = self.selector
        else{ const t = document.querySelectorAll(self.selector);self.el = (t.length > 1) ? t : t[0];}

        self.height = (val)=>{
            if(!val) return self.el.offsetHeight
            else self.el.offsetHeight = val
        }
        self.width = (val)=>{
            if(!val) return self.el.offsetWidth
            else self.el.offsetWidth = val
        }
        self.on = (type,callback)=>{
            if (typeof(self.el.length) === 'undefined' || self.el===window || self.el === document) self.el['on'+type] = callback
            else self.el.forEach((el)=> el['on'+type] = callback )
        }


        // Menu control for Nav
        // This allows you to quickly hide and show a nav and an overly with one function call
        // pass mg the name of your nav and overlay(or any element you want to toggle the class of in the process)
        // Keep in mind, you don't have to change the class of every element inside the nav in order to manipluate its css
        // e.g. mg('nav, .overlay')
        // now you call the menu.init() function and pass in any element you want to be clickable and ergo call the toggle class function
        // e.g. mg('nav, .partition').menu.init(mg('nav ul li a, .overly, .close-btn, etc.'))
        self.menu = {
            init: function(ctrls){ //Initialize Navigation controls
                this.nav = self.el
                this.ctrls = ctrls.el
                for(let n = this.ctrls.length;n--;){ this.ctrls[n].onclick = () => this.toggle(); }
            },
            nav: null,
            ctrls: null,
            toggle:/*Hide or Show Menu*/ function(){for(let n = this.nav.length;n--;){ this.nav[n].classList.toggle('hidden');}}
        }

        // Accordian Code
        self.accordian = {
            init: function(tabs){
                this.tabs = self.el
                for(let n=this.tabs.length;n--;){this.tabs[n].onclick = () => this.tabs[n].classList.toggle('active');}
            },
            tabs: null
        }

        // Slideshow Code
        self.slideshow = {
            p: {// p for Parameters(I'm lazy)
                slides:  null,
                arrows: null,
                rArrow: null,
                lArrow: null,
                activeClass: null,
                timers: {reset: 0, next: 0}
            },
            parent: null,
            curr: 1,
            busy: false,
            changeSlide: (e)=>{
                if(e.target.classList.contains('enabled') && !self.slideshow.busy){
                    // Determine direction
                    this.dir = (e.target.classList.contains('right')) ? 1 : -1

                    // Handle out-of-bounds and end-of-bounds scenarios (disable arrows)
                    if(this.dir + self.slideshow.curr > self.slideshow.p.slides.el.length || this.dir + self.slideshow.curr < 1) return;
                    else if(this.dir + self.slideshow.curr == self.slideshow.p.slides.el.length) self.slideshow.p.rArrow.el.classList.remove('enabled')
                    else if(this.dir + self.slideshow.curr == 1) self.slideshow.p.lArrow.el.classList.remove('enabled')

                    // Set slideshow to busy
                    self.slideshow.busy = true
                    // Remove Active Class from current slide
                    self.slideshow.p.slides.el[self.slideshow.curr-1].classList.remove(self.slideshow.p.activeClass)
                    // Reasign slide index
                    self.slideshow.curr += this.dir
                    // Set timer to add params.activeClass to next slide
                    setTimeout(()=>self.slideshow.p.slides.el[self.slideshow.curr-1].classList.add(self.slideshow.p.activeClass),self.slideshow.p.timers.next)
                    // Start timer to reset busy flag
                    setTimeout(()=>self.slideshow.busy = false,self.slideshow.p.timers.reset)

                    // Make sure the next/previous arrows are enabled if they aren't already when the opposite arrow is pressed
                    if(this.dir == 1 && !self.slideshow.p.lArrow.el.classList.contains('enabled'))self.slideshow.p.lArrow.el.classList.add('enabled')
                    else if(this.dir == -1 && !self.slideshow.p.rArrow.el.classList.contains('enabled'))self.slideshow.p.rArrow.el.classList.add('enabled')
                }
            },
            init: (params)=>{
                // Set parent parameter
                self.slideshow.parent = self.el
                // Assign paramenters
                mg.deepAssign(self.slideshow.p, params)
                // Set the click event listeners on the arrows for the slideshow
                self.slideshow.p.arrows.on('mousedown',self.slideshow.changeSlide)
                return self.slideshow
            }
        }

        return self
    }
    // Make MG globally accessible in the window document object.
    if(typeof(window.mg) === 'undefined'){
        window.mg = MG;
    }

    // Toolkit-esque Functions
    // These do not rely on the query functionality of the MG() function
    // so they are down here in the dirt. With the rest of us.

    // Image Preloader
    mg.images = new Array()
    mg.preloadImg = function (){
        for (let i = arguments.length; i--;){
            mg.images[i] = new Image()
            mg.images[i].src = mg.imgLoc + arguments[i]
        }
    }
    // Random Number Generators for decimals and integers
    mg.rand = ( max = 1,min = 0 )=>{ return Math.random() * (max - min) + min; }
    mg.randInt = ( max = 1, min = 0 )=>{ return Math.floor(Math.random() * (max - min + 1)) + min; }
    // Absolute Value
    mg.abs = (val)=>{ return (-(val) > 0) ? -(val): (val); }
    mg.isEven = (num)=> { return num % 2 == 0 } // Self explanatory
    mg.isOdd = (num)=> { return num % 2 == 1 } // Self explanatory
    // For a quick Class or ID
    mg.generateSelector = ( l = 1 )=>{ const g = { t: '', p: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'};for(let i = l; i--;)g.t+=g.p.charAt(mg.randInt((i==(l-1)) ? g.p.length-11 : g.p.length-1));return g.t;}
    // Encode form Data
    mg.formEncode = ( obj )=>{
        let str = []
        for(let p in obj){
            str.push( encodeURIComponent( p ) + "=" + encodeURIComponent( obj[p] ) )
        }
        return str.join("&")
    }
    // Array Shuffle
    // From: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    mg.shuffle = (array)=>{
        let currentIndex = array.length, temporaryValue, randomIndex
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);currentIndex -= 1
            temporaryValue = array[currentIndex];array[currentIndex] = array[randomIndex];array[randomIndex] = temporaryValue
        }
        return array
    }
    // Object.assign(deep)
    // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    mg.deepAssign = (target, ...sources)=>{
        sources.forEach(source => {
            let descriptors = Object.keys(source).reduce((descriptors, key) => {
            descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            return descriptors;
            }, {});
            // by default, Object.assign copies enumerable Symbols too
            Object.getOwnPropertySymbols(source).forEach(sym => {
            let descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor.enumerable) {
            descriptors[sym] = descriptor;
            }
            });
            Object.defineProperties(target, descriptors);
        });
        return target;
    }
    // Modal code
    mg.createModal = (str = '', btns = [])=>{
        // Add a whole modal thingy ma bob here that will
        // - clone a base modal template
        const c = { // for clone
            e: document.querySelector('div.modal').cloneNode(true),// e for element
        // - create a unique className
            gc: mg.generateSelector(5) ,// gc for generated class
            p: null,
            n: null // node
        }
        // Appply class
        c.e.classList.add(c.gc)
        // - add the text
        if(typeof str === 'string'){
            c.p = document.createElement('p')
            c.n = document.createTextNode(str)
            c.p.appendChild(c.n)
            c.e.children[1].appendChild(c.p)
        }
        if(typeof str === 'object'){
            for(let i = 0; i <str.length; i++){
                c.p = document.createElement('p')
                c.n = document.createTextNode(str[i])
                c.p.appendChild(c.n)
                c.e.children[1].appendChild(c.p)
            }
        }
        // - format buttons(later development)

        // - append Modal clone to body
        document.body.appendChild(c.e)
        // - reveal modal after the element has had time to be registered as hidden
        setTimeout(()=>c.e.classList.remove('hidden'),256)
        // - add event listeners
        document.querySelectorAll('div.modal.'+c.gc+' span.close').forEach((e)=>{
            e.addEventListener('click',()=>{
                // - destroy clone
                c.e.classList.add('hidden')
                setTimeout(()=>c.e.remove(),1500)
            })
        })
    }

})(window); // Pass the window variable into MG
