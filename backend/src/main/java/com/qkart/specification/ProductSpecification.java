package com.qkart.specification;

import com.qkart.dto.ProductSearchCriteria;
import com.qkart.model.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> withCriteria(ProductSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Text search (name or description)
            if (criteria.getQuery() != null && !criteria.getQuery().trim().isEmpty()) {
                String searchPattern = "%" + criteria.getQuery().toLowerCase() + "%";
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(namePredicate, descPredicate));
            }

            // Category filter (multi-select)
            if (criteria.getCategories() != null && !criteria.getCategories().isEmpty()) {
                predicates.add(root.get("category").in(criteria.getCategories()));
            }

            // Price range filter
            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));
            }

            // Rating filter
            if (criteria.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), criteria.getMinRating()));
            }

            // Stock availability filter
            if (criteria.getInStock() != null) {
                if (criteria.getInStock()) {
                    predicates.add(cb.greaterThan(root.get("stock"), 0));
                } else {
                    predicates.add(cb.equal(root.get("stock"), 0));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
