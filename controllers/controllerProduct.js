const { Product, Category, Recipe, RawMaterial } = require("../models");

class ControllerProduct {
  static async cretaeCategory(req, res) {
    try {
      const { name, description } = req.body;
      console.log(req.body, "<<<");

      const newCategory = await Category.create({
        name,
        description,
      });

      res.status(201).json(newCategory);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async cretaeProduct(req, res) {
    try {
      const { name, price, costPrice, categoryId } = req.body;

      const newProduct = await Product.create({
        name,
        price,
        costPrice,
        categoryId,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async getCategory(req, res) {
    try {
      const categories = await Category.findAll();

      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async getProduct(req, res) {
    try {
      const { categoryId, page = 1, size = 10 } = req.query; // Default page 1 dan size 10
      const limit = parseInt(size); // Mengubah size menjadi integer
      const offset = (page - 1) * limit; // Menghitung offset berdasarkan halaman

      const condition = categoryId ? { categoryId } : {}; // Kondisi filter berdasarkan categoryId jika ada

      // Query untuk mengambil produk dengan paginasi dan kategori
      const products = await Product.findAndCountAll({
        where: condition, // Filter berdasarkan categoryId jika ada
        include: [
          {
            model: Category, // Join dengan tabel Category
            as: "category", // Alias yang sesuai dengan yang ada di model
          },
          {
            model: Recipe, // Join dengan tabel Recipe
            as: "recipes", // Alias untuk model Recipe
            include: [
              {
                model: RawMaterial, // Join dengan tabel RawMaterial
                as: "rawMaterial", // Alias untuk model RawMaterial
              },
            ],
            required: false, // Jika ingin mendapatkan produk meskipun tidak ada resep terkait
          },
        ],
        limit, // Batasan jumlah hasil per halaman
        offset, // Posisi awal hasil pada halaman tertentu
      });

      // Menghitung total halaman berdasarkan jumlah total data dan ukuran per halaman
      const totalPages = Math.ceil(products.count / limit);

      // Mengirimkan hasil dengan informasi paginasi
      res.status(200).json({
        data: products.rows, // Hasil produk
        currentPage: parseInt(page), // Halaman saat ini
        totalPages, // Total halaman
        totalItems: products.count, // Jumlah total produk
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Failed to fetch products", error });
    }
  }

  static async deleteProduct(req, res) {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }
      await product.destroy();

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}

module.exports = ControllerProduct;
