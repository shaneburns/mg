# MG - Master Global Toolkit
Replacing jQuery, retaining functionality, refining skills.

### Full documentation coming soon...

# Funcitonality
  ## mg() :
    > Accepts string or DOMobject as its one and only condition
    Keys{
      - self: 
          > reference to this,
      - selector :
          > string/DOMobject passed in on main function call,
      - el :
          > element or NodeList of elements returned from document.querySelectorAll(self.selector),
      - etc. :>
    }
  ## mg.rand(max,min) : 
    > Accepts a maximum and minimum value to choose a random *number* between.  
    (These values are set to 1 and 0 by default.)
  ## mg.randInt(max,min) : 
    > Accepts a maximum and minimum value to choose a random *integer* between.  
    (These values are set to 1 and 0 by default.)
  ## mg.abs(val) : 
    > Accepts a number value and returns it's absolute value
