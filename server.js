const express = require("express");
const app = express();
const port = 7006;

app.use(express.static(__dirname)); // Serve files from the current directory

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/api/data", (req, res) => {
  // Load and serve your JSON data here
  const jsonData = {
    list: [
      {
        origin: "http://localhost:7006",
        rules: [
          {
            textToRemove: "Delete me",
            deep: 1,
          },
          {
            textToRemove: "Remove me deeper",
            deep: 2,
          },
          {
            selectorToRemove: ".class-to-remove",
            deep: 1,
          },
          {
            selectorToRemove: ".class-to-remove-deeper",
            deep: 2,
          },
        ],
      },
      {
        origin: "http://localhost:7007",
        rules: [
          {
            textToRemove: "Remove me",
            deep: 2,
          },
          {
            selectorToRemove: ".class-to-remove",
            deep: 1,
          },
        ],
      },
    ],
  };
  res.json(jsonData);
});
