package com.qkart.config;

import com.qkart.model.*;
import com.qkart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (userRepository.count() == 0) {
            seedUsers();
        }
    }

    private void seedProducts() {
        Product[] products = {
            createProduct("iPhone 15 Pro", "Latest Apple smartphone with A17 Pro chip", new BigDecimal("999.99"), "Electronics", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", 50),
            createProduct("MacBook Air M3", "Thin and light laptop with Apple M3 chip", new BigDecimal("1299.99"), "Electronics", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", 30),
            createProduct("Sony WH-1000XM5", "Premium noise-canceling wireless headphones", new BigDecimal("349.99"), "Electronics", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", 100),
            createProduct("Samsung 65\" 4K TV", "Crystal UHD Smart TV with HDR", new BigDecimal("799.99"), "Electronics", "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", 25),
            createProduct("Nike Air Max 90", "Classic running shoes with Air cushioning", new BigDecimal("129.99"), "Footwear", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", 200),
            createProduct("Adidas Ultraboost", "Premium running shoes with Boost technology", new BigDecimal("179.99"), "Footwear", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400", 150),
            createProduct("Levi's 501 Jeans", "Classic straight fit denim jeans", new BigDecimal("79.99"), "Clothing", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", 300),
            createProduct("North Face Jacket", "Waterproof outdoor jacket", new BigDecimal("199.99"), "Clothing", "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400", 75),
            createProduct("Ray-Ban Aviator", "Classic aviator sunglasses", new BigDecimal("159.99"), "Accessories", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", 120),
            createProduct("Apple Watch Series 9", "Advanced health and fitness smartwatch", new BigDecimal("399.99"), "Electronics", "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400", 80),
            createProduct("Dyson V15 Vacuum", "Cordless vacuum with laser detection", new BigDecimal("749.99"), "Home", "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400", 40),
            createProduct("KitchenAid Mixer", "Professional stand mixer", new BigDecimal("449.99"), "Home", "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400", 60)
        };

        productRepository.saveAll(Arrays.asList(products));
    }

    private Product createProduct(String name, String description, BigDecimal price, String category, String imageUrl, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        return product;
    }

    private void seedUsers() {
        User user = new User();
        user.setEmail("demo@qkart.com");
        user.setName("Demo User");
        user = userRepository.save(user);

        Address address = new Address();
        address.setUser(user);
        address.setStreet("123 Main Street");
        address.setCity("San Francisco");
        address.setState("CA");
        address.setZipCode("94105");
        address.setCountry("USA");
        address.setDefault(true);
        addressRepository.save(address);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);
    }
}
