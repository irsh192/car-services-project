const express = require('express');
const router = express.Router();
const { User, Category, Product, Order } = require('./models/models'); // Make sure this path is correct
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

function convertImageToBase64(image) {
  // Ensure to prefix the base64 string with the correct MIME type
  return `data:${image.contentType};base64,${image.imageData.toString('base64')}`;
}

// POST request to create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//signup
router.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please try another email.',
        specialMsg: 'USER_ALREADY_EXISTS'
      });
    }
    street_address = '';
    city = '';
    postal_code = '';
    state = '';
    country = '';
    const newUser = new User({ first_name, last_name, email, password, street_address, city, postal_code, state, country});
    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      specialMsg: 'USER_CREATED_SUCCESSFULLY'
    });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Failed to create user. Please try again.',
          error: error.toString(),
          specialMsg: 'ERROR_CREATING_USER'
        });
     }
  });


//Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      // Login successful, setting user information in session
      req.session.user = { id: user.id, email: user.email };
      req.session.isLoggedIn = true;
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        is_superuser: user.is_superuser,
        email: user.email,
        address: user.address,
        city: user.city,
        zip_code: user.zip_code
      };
      res.json({status:200, isLoggedIn: true, user: userData});

    } else {
      res.json({status:400, isLoggedIn:false, user:null});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({"status": "An error occurred during login"}); // And also here
  }
});
//logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ status: "Error logging out" });
    }
    res.status(200).json({ status: "Logout successful" });
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get Profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update Profile
router.post('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (user) {
      res.send({status:'Profile updated successfully'});
    } else {
      res.status(404).send({status:'User not found'});
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


//Add Categroies
router.post('/create-category', async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      cat_type: req.body.cat_type,
      description: req.body.description
    });
    await category.save();
    res.status(201).send({status:category});
  } catch (error) {
    console.log(error);
    res.status(400).send({status: error});
  }
});

// All Categories
router.get('/all-categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add product
router.post('/add-product', upload.array('images', 5), async (req, res) => {
  // Validate the provided category_id
  if (!mongoose.Types.ObjectId.isValid(req.body.productCategory)) {
    return res.status(400).send({ status: 'Error', message: 'Invalid category ID' });
  }
  try {
    const category = await Category.findById(req.body.productCategory);
    if (!category) {
      return res.status(404).send({ status: 'Error', message: 'Category not found' });
    }
    // Prepare the images for embedding
    const images = req.files.map(file => ({
      imageData: file.buffer,
      contentType: file.mimetype
    }));
    // Create a new product with embedded images and an initial update record
    const product = new Product({
      name: req.body.productName,
      shortDescription: req.body.shortDescription,
      description: req.body.productDescription,
      price: req.body.price,
      stock_quantity: req.body.totalItemsInStock,
      category_id: category._id,
      images: images,
      updated_at: [{ date: new Date(), message: "Product created" }]  // Initialize the update history
    });
    const savedProduct = await product.save();
    res.status(201).send({ status: 'Product added successfully with images', product: savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Server error', error: error.message });
  }
});


// Get single product
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('images');
    if (!product) {
      return res.status(404).send('Product not found');
    }
    const productWithBase64Images = {
      ...product.toObject(),  // Convert Mongoose document to plain object
      images: product.images.map(convertImageToBase64)
    };

    res.json(productWithBase64Images);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Add stock 
router.post('/add-stock/:productid', async (req, res) => {
  const { productid } = req.params;
  const { stock } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(productid, {
    $inc: { stock_quantity: stock },
    $push: {
      updated_at: {
        date: new Date(),
        message: `Added ${stock} units to stock`
      }
    }
  }, { new: true, upsert: false });

  if (!updatedProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ message: 'Stock added successfully', updatedProduct });
  
});


// Delete Product From inventory
router.delete('/product/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete the product', error: error });
  }
});



// Update Product
router.put('/update-product/:id', upload.array('images', 5), async (req, res) => {
  const productId = req.params.id;

  // Validate the product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send({ status: 'Error', message: 'Invalid product ID' });
  }
  try {
    // Fetch the existing product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ status: 'Error', message: 'Product not found' });
    }
    // Validate the provided category_id, if changed
    if (req.body.productCategory && req.body.productCategory !== product.category_id.toString()) {
      if (!mongoose.Types.ObjectId.isValid(req.body.productCategory)) {
        return res.status(400).send({ status: 'Error', message: 'Invalid category ID' });
      }
      const category = await Category.findById(req.body.productCategory);
      if (!category) {
        return res.status(404).send({ status: 'Error', message: 'Category not found' });
      }
      product.category_id = category._id;  // Update the category if it has changed
    }
    // Update the product fields
    product.name = req.body.productName || product.name;
    product.description = req.body.productDescription || product.description;
    product.price = req.body.price || product.price;
    product.stock_quantity = req.body.totalItemsInStock || product.stock_quantity;
    // Update the images if new ones are provided
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        imageData: file.buffer,
        contentType: file.mimetype
      }));
      product.images = images;  // Replace the existing images
    }
    // Append a new update record to the updated_at field
    const updateMessage = `Product updated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    product.updated_at.push({ date: new Date(), message: updateMessage });
    // Save the updated product
    const updatedProduct = await product.save();
    res.send({ status: 'Success', message: 'Product updated successfully with new update history', product: updatedProduct });

  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Server error', error: error.message });
  }
});



router.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find();

    // Process the products to include the first image encoded in Base64
    const productsWithFirstImage = products.map(product => {
      let imageBase64 = null;

      // Check if there is at least one image and if so, convert the first one to Base64
      if (product.images && product.images.length > 0 && product.images[0].imageData) {
        imageBase64 = `data:${product.images[0].contentType};base64,${product.images[0].imageData.toString('base64')}`;
      }

      return {
        ...product.toObject(),
        imageBase64: imageBase64  // Include the image data in the response
      };
    });

    res.status(200).json(productsWithFirstImage);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: error.message });
  }
});



router.get('/home-categories', async (req, res) => {
  try {
    // Fetch the first 4 categories, assuming they need to be sorted or filtered by 'cat_type'
    const categories = await Category.find().sort({ cat_type: 1 });
    // Prepare to fetch products for these categories
    const categoryIds = categories.map(category => category._id);
    const products = await Product.find({
      category_id: { $in: categoryIds }
    }).populate('category_id', 'name'); // Populate category name if needed
    // Map products back to their categories
    const categoriesWithProducts = categories.map(category => ({
      ...category.toObject(),
      products: products.filter(product => product.category_id.equals(category._id)).map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        shortDescription: product.shortDescription,
        description: product.description,
        stock_quantity: product.stock_quantity,
        images: product.images.map(convertImageToBase64),
        created_at: product.created_at,
        updated_at: product.updated_at
      }))
    }));

    res.json(categoriesWithProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Categories for header
router.get('/fetch-categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    const formattedCategories = categories.map(category => {
      return {
        cat_type: category.cat_type,
        path: `/${category.cat_type.toLowerCase()}/${category.name.replace(/\s+/g, '').toLowerCase()}`,
        label: category.name
      };
    });
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch categories', error: error });
  }
});


// products based by category
router.get('/products/:cat_type/:category_name', async (req, res) => {
  try {
      const { cat_type, category_name } = req.params;
      const regexCatType = new RegExp('^' + cat_type + '$', 'i'); // Case-insensitive
      const regexCategoryName = new RegExp('^' + category_name + '$', 'i'); // Case-insensitive
      const category = await Category.findOne({ name: regexCategoryName, cat_type: regexCatType });
      if (!category) {
          return res.status(404).send('Category not found');
      }
      const products = await Product.find({ category_id: category._id }).populate('images');
      const convertedProducts = products.map(product => ({
      ...product.toObject(),
      images: product.images.map(image => convertImageToBase64(image)) // Convert each image
    }));

    res.json(convertedProducts);

  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
});
// cart products
router.post('/get-cart-products', async (req, res) => {
  try {
      const productIds = req.body.productIds;
      const products = await Product.find({
          '_id': { $in: productIds }
      });
      const convertedProducts = products.map(product => ({
        ...product.toObject(),
        images: product.images.map(image => convertImageToBase64(image)) // Convert each image
    }));
      res.json(convertedProducts);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});


//  Stock Checker 
router.post('/check-stock', async (req, res) => {
  try {
    const { products } = req.body; // products should be an array of { productId, quantity }

    for (const product of products) {
        const productDetails = await Product.findById(product.productId);
        if (productDetails && product.quantity > productDetails.stock_quantity) {
            // If the stock is insufficient, immediately return an error response
            return res.status(409).json({
                message: `Insufficient stock for ${productDetails.name}, only ${productDetails.stock_quantity} available`
            });
        } else if (!productDetails) {
            // If the product details are not found, also return an error
            return res.status(404).json({
                message: `Product with ID ${product.productId} not found`
            });
        }
    }
    // If all products have sufficient stock, send a success response
    res.status(201).json({ message: "All items are available for checkout." });
  } catch (error) {
    res.status(500).json({ message: "Error checking stock", error: error.message });
  }
});


// Create Order
router.post('/submit-order', async (req, res) => {
  try {
    const { user_id, user, products, total } = req.body;
    // Check stock availability for each product before processing the order
    for (const product of products) {
        const { productId, quantity } = product;
        const productDetails = await Product.findById(productId);
        if (quantity > productDetails.stock_quantity) {
            return res.status(400).send({
                message: `Insufficient stock for ${productDetails.name}, only ${productDetails.stock_quantity} available`
            });
        }
    }
    // Proceed to create order if all products have sufficient stock
    const newOrder = new Order({
        user_id,
        user,
        products,
        total,
        status: 'pending' // Default status
    });
    await newOrder.save();

    // Update stock quantities for each product
    for (const product of products) {
        const { productId, quantity } = product;
        await Product.updateOne(
            { _id: productId },
            { 
              $inc: {
                stock_quantity: -quantity,  // Decrement the stock_quantity by the quantity ordered
                total_sold: quantity        // Increment the total_sold by the quantity ordered
              }
            } // Decrement the stock_quantity by the quantity ordered
        );
    }
    res.status(201).send({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
      res.status(500).send({ message: 'Error placing order', error: error.message });
  }
});



// Orders
router.get('/orders', async (req, res) => {
  const userId = req.query.userId; // Received from the query parameter

  try {
      let query = {};
      if (userId) {
          query.user_id = userId; // Filter orders by user ID if provided
      }

      const orders = await Order.find(query).populate('user_id', 'email name').exec(); // Optionally populate user details
      res.status(200).json(orders);
  } catch (error) {
      res.status(500).send({ message: 'Error fetching orders', error: error.message });
  }
});




module.exports = router;
