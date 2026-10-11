class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString =
      queryString || {};
  }

  // ====================================================
  // FILTER
  // ====================================================

  filter() {
    const queryObj = {
      ...this.queryString,
    };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "city",
      "guests",
      "dateIn",
      "dateOut",
      "minPrice",
      "maxPrice",
    ];

    excludedFields.forEach(
      (field) =>
        delete queryObj[field]
    );

    // -----------------------------
    // Price
    // -----------------------------

    const {
      minPrice,
      maxPrice,
    } = this.queryString;

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      queryObj.pricePerNight = {};

      if (
        minPrice !== undefined &&
        !Number.isNaN(
          Number(minPrice)
        )
      ) {
        queryObj.pricePerNight.$gte =
          Number(minPrice);
      }

      if (
        maxPrice !== undefined &&
        !Number.isNaN(
          Number(maxPrice)
        )
      ) {
        queryObj.pricePerNight.$lte =
          Number(maxPrice);
      }
    }

    // -----------------------------
    // Property Type
    // -----------------------------

    if (queryObj.propertyType) {
      const propertyTypes =
        Array.isArray(
          queryObj.propertyType
        )
          ? queryObj.propertyType
          : queryObj.propertyType.split(
              ","
            );

      queryObj.propertyType = {
        $in: propertyTypes
          .map((value) =>
            value
              .trim()
              .toLowerCase()
          )
          .filter(Boolean),
      };
    }

    // -----------------------------
    // Room Type
    // -----------------------------

    if (queryObj.roomType) {
      queryObj.roomType =
        queryObj.roomType
          .trim()
          .toLowerCase();
    }

    // -----------------------------
    // Amenities
    // -----------------------------

    if (queryObj.amenities) {
      const amenities =
        Array.isArray(
          queryObj.amenities
        )
          ? queryObj.amenities
          : queryObj.amenities.split(
              ","
            );

      queryObj.amenities = {
        $all: amenities
          .map((value) =>
            value
              .trim()
              .toLowerCase()
          )
          .filter(Boolean),
      };
    }

    // -----------------------------
    // Availability
    // -----------------------------

    if (
      queryObj.isAvailable !==
      undefined
    ) {
      queryObj.isAvailable =
        queryObj.isAvailable ===
          true ||
        queryObj.isAvailable ===
          "true";
    }

    this.query =
      this.query.find(queryObj);

    return this;
  }

  // ====================================================
  // SEARCH
  // ====================================================

  search() {
    const conditions = [];

    // Escape special regex characters
    const escapeRegex = (value) =>
      String(value).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    // -----------------------------
    // City
    // -----------------------------

    if (this.queryString.city) {
      const city = escapeRegex(
        this.queryString.city.trim()
      );

      conditions.push({
        $or: [
          {
            "address.city": {
              $regex: city,
              $options: "i",
            },
          },

          {
            "address.state": {
              $regex: city,
              $options: "i",
            },
          },

          {
            title: {
              $regex: city,
              $options: "i",
            },
          },
        ],
      });
    }

    // -----------------------------
    // General Search
    // -----------------------------

    if (this.queryString.search) {
      const search = escapeRegex(
        this.queryString.search.trim()
      );

      conditions.push({
        $or: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },

          {
            description: {
              $regex: search,
              $options: "i",
            },
          },

          {
            "address.city": {
              $regex: search,
              $options: "i",
            },
          },

          {
            "address.state": {
              $regex: search,
              $options: "i",
            },
          },
        ],
      });
    }

    // -----------------------------
    // Guests
    // -----------------------------

    if (this.queryString.guests) {
      const guests = Number(
        this.queryString.guests
      );

      if (
        !Number.isNaN(guests) &&
        guests > 0
      ) {
        conditions.push({
          maxGuests: {
            $gte: guests,
          },
        });
      }
    }

    if (conditions.length > 0) {
      this.query =
        this.query.find({
          $and: conditions,
        });
    }

    return this;
  }

  // ====================================================
  // SORT
  // ====================================================

  sort() {
    if (this.queryString.sort) {
      const sortBy =
        this.queryString.sort
          .split(",")
          .join(" ");

      this.query =
        this.query.sort(sortBy);
    } else {
      this.query =
        this.query.sort(
          "-createdAt"
        );
    }

    return this;
  }

  // ====================================================
  // FIELD LIMITING
  // ====================================================

  limitFields() {
    if (
      this.queryString.fields
    ) {
      const fields =
        this.queryString.fields
          .split(",")
          .join(" ");

      this.query =
        this.query.select(fields);
    } else {
      this.query =
        this.query.select("-__v");
    }

    return this;
  }

  // ====================================================
  // PAGINATION
  // ====================================================

  paginate() {
    let page =
      Number(
        this.queryString.page
      ) || 1;

    let limit =
      Number(
        this.queryString.limit
      ) || 12;

    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 12;
    }

    if (limit > 100) {
      limit = 100;
    }

    const skip =
      (page - 1) * limit;

    this.query =
      this.query
        .skip(skip)
        .limit(limit);

    return this;
  }
}

export { APIFeatures };