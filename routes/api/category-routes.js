const router = require('express').Router();
const { Category, Product } = require('../../models');

// Handle errors by centralizing error handling
const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'An error occurred' });
};

// Middleware to handle common logic for all routes
router.use(async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json({ message: 'No category found with that id.' });
    } else {
      req.category = category;
      next();
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (error) {
    handleErrors(res, error);
  }
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.category);
});

router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(201).json(categoryData);
  } catch (error) {
    handleErrors(res, error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedRows] = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      res.status(404).json({ message: 'Category id does not exist!' });
    } else {
      res.status(200).json({ message: 'Category updated successfully' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id },
    });
    if (categoryData === 0) {
      res.status(404).json({ message: 'Category id does not exist!' });
    } else {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = router;
