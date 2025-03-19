const puppeteer = require("puppeteer")
const convertHtmlToText = require("../helper/convertHtmlToText")
const {responseInValid, responseServerError, reponseSuccess, responseSuccessWithData} = require("../helper/ResponseRequests")
// const getWebsite = async (req, res) => {
//     if(!req.query.website) {
//         return responseInValid({res, message:"website required"})
//     }
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(req.query.website);
//     const html = await page.content()
//     return res.status(200).send(html)

// }

const testWebsite = async (req,res) => {
  const website = req.query.website
  if(!website) {
    return responseInValid({res, message:"website required"})
  }
  const browser = await puppeteer.launch({
    timeout: 0
  })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(0)
  await page.goto(website, {timeout: 0}) 
  const content = await page.$eval("*", el => el.innerHTML)
  const title = await page.$$eval('h1', elements => {
    return elements[0]?.textContent.trim() || " "
  })

  // const content = await page.$$eval('p', elements => {
  //   const string =  elements.reduce((acc, value)  => acc.concat(" ", value?.textContent.trim() || " "), "")
  //   return string
  //   // return elements.map(el => {
  //   //   return {
  //   //     tag: el.tagName,
  //   //     content: el.textContent.trim()
  //   //   };
  //   // });
  // })

  const  data = {title, content: convertHtmlToText(content)}

  // return responseSuccessWithData({res, data: convertHtmlToText(content)})
  return responseSuccessWithData({res, data: data})
}


const getWebsite = async (req, res) => {
    
    const {website, countPage} = req.query
    if(!website) {
        return responseInValid({res, message:"website required"})
    }
    const browser = await puppeteer.launch({
      timeout: 0
    });

    const registry = {};
    let queue = [website];
    

    while (queue.length > 0 && queue.length < countPage) {
      // try {

          const url = queue[queue.length - 1];
        // console.log("current url", url);
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0)
        const check = await page.goto(url, {timeout: 0});

        if (check == null) {
          continue;
        }

        //test
    
        registry[url] = await page.$eval("*", (el) => el.innerText);
        queue.pop();


        const hrefs = await page.$$eval("a", (anchorEls) =>
          anchorEls.map((a) => a.href)
        );

        const filteredHrefs = hrefs.filter(
          (href) => href.startsWith(website) && registry[href] === undefined
        );
        const uniqueHrefs = [...new Set(filteredHrefs)];
        queue.push(...uniqueHrefs);
        queue = [...new Set(queue)];
        await page.close();
    }

    let index = 0;
    const result = []

    while (index < countPage) {
      try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0)
        const check = await page.goto(queue[index], {timeout: 0});
       if (check == null) {
        
          continue;
        }
        // const content = await page.$eval("*", el => el.innerHTML)
         const content = await page.$$eval('p', elements => {
          const string =  elements.reduce((acc, value)  => acc.concat(" ", value?.textContent.trim() || " "), "")
          return string
          
        })
        const title = await page.$$eval('h1', elements => {
          return elements[0]?.textContent.trim() || " "
        });

                
        result.push({
          content: content,
          title: title,
          url: queue[index]
        });
        index ++;
      
        await page.close()
      } catch (err) {
        index ++;
        console.log(err)
        continue;
      }
    }

    
    browser.close();



    return responseSuccessWithData({res, data: {
      count: result.length,
      result: result,
     
    }})
    
}

module.exports = {
    getWebsite,
    testWebsite
}