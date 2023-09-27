document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".proceed-btn");
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const getElementsByXPath = (textString) => {
      const xpathExpression = `//*[contains(text(), "${textString}")]`;

      const result = document.evaluate(
        xpathExpression,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );

      const matchingElements = [];
      let node;

      while ((node = result.iterateNext())) {
        matchingElements.push(node);
      }
      return matchingElements;
    };

    const findNodes = (rules) => {
      let dataToProceed = [];
      rules.forEach((r) => {
        for (key in r) {
          if (key === "textToRemove") {
            const text = r[key];
            const selectors = getElementsByXPath(text);
            dataToProceed.push({ deep: r?.deep || 1, selectors });
          }
          if (key === "selectorToRemove") {
            const selector = r[key];
            const selectors = document.querySelectorAll(selector);
            dataToProceed.push({ deep: r?.deep || 1, selectors });
          }
        }
      });
      return dataToProceed;
    };

    const findNodesToRemove = (rules) => {
      const nodesToPrepare = findNodes(rules);
      const nodesToRemove = [];
      const recFindNodesToRemove = (node, deep) => {
        nodesToRemove.push(node);
        if (deep > 1) {
          recFindNodesToRemove(node.parentNode, deep - 1);
        }
      };
      nodesToPrepare.forEach(({ selectors, deep }) => {
        selectors.forEach((selectorNode) => {
          recFindNodesToRemove(selectorNode, deep);
        });
      });
      return nodesToRemove;
    };

    fetch("/api/data")
      .then(async (r) => {
        let rules = [];
        const response = await r.json();
        response.list.forEach((d) => {
          if (d.origin === window.location.origin) {
            d.rules.forEach((r) => rules.push(r));
          }
        });

        if (rules) {
          const nodesToRemove = findNodesToRemove(rules);
          if (nodesToRemove.length) {
            nodesToRemove.forEach((node) => node.remove());
          }
        }
      })
      .catch((e) => {
        throw new Error(e);
      });
  });
});
