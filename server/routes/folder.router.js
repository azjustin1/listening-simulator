const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Custom route to move an item to a folder
router.post('/move/:folderId', (req, res) => {
  const { folderId } = req.params;
  const { item } = req.body;

  try {
    // Load the database
    const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    // Find the target folder
    const targetFolder = db.folders.find((folder) => folder.id === folderId);

    if (!targetFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Add the item to the target folder
    targetFolder.items.push(item);

    // Save the updated database
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

    res.status(200).json({ message: 'Item moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error moving item' });
  }
});

module.exports = router;