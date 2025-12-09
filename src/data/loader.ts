import api from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import { Locale } from "next-intl";

export const getGlobalSetiings = async (locale: Locale) => {
  const data = await api.get(API_ROUTES.GLOBAL_SETTINGS, {
    params: {
      locale,
      populate: {
        header: {
          populate: {
            navigations: {
              populate: {
                navigation: {
                  fields: ["slug"],
                },
                navigations: {
                  populate: {
                    navigation: {
                      fields: ["slug"],
                    },
                    navigations: {
                      populate: {
                        navigation: {
                          fields: ["slug"],
                        },
                      },
                    },
                  },
                },
              },
            },
            logo: {
              populate: {
                image: {
                  fields: ["url", "alternativeText", "width", "height"],
                },
              },
            },
	    facultyWork: true,
          },
        },
        footer: {
          populate: {
            contact: {
              populate: {
                socialLinks: {
                  populate: {
                    link: true,
                  },
                },
              },
            },
            logo: {
              populate: {
                image: {
                  fields: ["url", "alternativeText", "width", "height"],
                },
              },
            },
            quickLinks: {
              fields: ["text", "slug"],
              populate: {
                navigations: {
                  fields: ["text", "slug", "pageType", "singlePageContent"],
                  populate: {
                    navigations: {
                      fields: ["text", "slug", "pageType", "singlePageContent"],
                    },
                  },
                },
              },
            },
            copyRight: {
              fields: ["text"],
              populate: {
                links: true,
              },
            },
          },
        },
        favicon: {
          fields: ["url"],
        },
      },
    },
    next: {
      tags: ["global", "navigation"],
    },
  });
  return data.data;
};

export const getHomePage = async (locale: Locale) => {
  const data = await api.get(API_ROUTES.HOME_PAGE, {
    params: {
      locale,
      populate: {
        blocks: {
          on: {
            "blocks.common-block": {
              populate: {
                articles: {
                  fields: [
                    "title",
                    "shortDescription",
                    "slug",
                    "updatedAt",
                    "createdAt",
                    "publishedAt",
                  ],
                  populate: {
                    thumbnail: {
                      fields: ["url", "alternativeText", "width", "height"],
                    },
                    tag: {
                      fields: ["text", "color", "slug"],
                    },
                  },
                },
                link: true,
                backgroundImage: {
                  fields: ["url", "alternativeText", "width", "height"],
                },
              },
            },
          },
        },
      },
    },
    next: {
      tags: ["home-page", "article", "event", "tag", "navigation"],
    },
  });
  return data.data;
};

export const getNavigationBySlug = async (locale: Locale, pageSlug: string) => {
  try {
    const data = await api.get(API_ROUTES.NAVIGATION, {
      params: {
        locale,
        filters: {
          slug: {
            $eq: pageSlug,
          },
        },
        fields: ["text", "slug", "pageType", "singlePageContent"],
        populate: {
          navigation: {
            fields: ["text", "slug", "pageType", "singlePageContent"],
            populate: {
              navigations: {
                fields: ["text", "slug", "pageType", "singlePageContent"],
                populate: {
                  navigations: {
                    fields: ["slug"],
                  },
                },
              },
            },
          },
          navigations: {
            fields: ["text", "slug", "pageType", "singlePageContent"],
          },
        },
      },
      next: {
        tags: ["navigation"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getAllNavigation = async (locale: Locale) => {
  try {
    const data = await api.get(API_ROUTES.NAVIGATION, {
      params: {
        locale,
        fields: ["slug"],
        populate: {
          navigation: {
            fields: ["slug"],
          },
        },
        pagination: {
          pageSize: 1000,
        },
        next: {
          tags: ["navigation"],
        },
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getListArticleByNavigationId = async (
  locale: Locale,
  navigationId: number,
  page: number = 1,
  pageSize: number = 25
) => {
  try {
    const data = await api.get(API_ROUTES.ARTICLE, {
      params: {
        locale,
        filters: {
          insertToPage: {
            id: {
              $eq: navigationId,
            },
          },
        },
        sort: {
          publishedAt: "desc",
        },
        fields: [
          "title",
          "shortDescription",
          "slug",
          "updatedAt",
          "createdAt",
          "publishedAt",
        ],
        pagination: {
          page,
          pageSize,
        },
        populate: {
          insertToPage: {
            fields: ["text", "slug"],
          },
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          tag: {
            fields: ["text", "color", "slug"],
          },
        },
      },
      next: {
        tags: ["article", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getListArticle = async (locale: Locale) => {
  try {
    const data = await api.get(API_ROUTES.ARTICLE, {
      params: {
        locale,
        fields: ["slug"],
      },
      next: {
        tags: ["article", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getDetailArticleBySlug = async (
  locale: Locale,
  articleSlug: string
) => {
  try {
    const data = await api.get(API_ROUTES.ARTICLE, {
      params: {
        locale,
        filters: {
          slug: {
            $eq: articleSlug,
          },
        },
        fields: [
          "title",
          "shortDescription",
          "slug",
          "updatedAt",
          "createdAt",
          "publishedAt",
          "content",
        ],
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          tag: {
            fields: ["text", "color", "slug"],
          },
          insertToPage: {
            fields: ["text", "slug"],
          },
          author: {
            fields: ["name", "email", "username", "position", "displayName"],
            populate: {
              avatar: {
                fields: ["url", "alternativeText", "width", "height"],
              },
            },
          },
          relatedArticles: {
            fields: [
              "title",
              "shortDescription",
              "slug",
              "updatedAt",
              "createdAt",
              "publishedAt",
            ],
            populate: {
              thumbnail: {
                fields: ["url", "alternativeText", "width", "height"],
              },
            },
          },
        },
      },
      next: {
        tags: ["article", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getStaffByUsername = async (locale: Locale, username: string) => {
  try {
    const data = await api.get(API_ROUTES.AUTHOR, {
      params: {
        locale,
        filters: {
          username: {
            $eq: username,
          },
        },
        populate: {
          avatar: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          socialLinks: {
            populate: {
              link: true,
            },
          },
          blockDescription: true,
        },
      },
      next: {
        tags: ["author", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getListStaff = async (locale: Locale) => {
  try {
    const data = await api.get(API_ROUTES.AUTHOR, {
      params: {
        locale,
        fields: ["username", "displayName"],
        sort: {
          order: "asc",
        },
        populate: {
          avatar: {
            fields: ["url", "alternativeText", "width", "height"],
          },
        },
      },
      next: {
        tags: ["author", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getListEventByNavigationId = async (
  locale: Locale,
  navigationId: number
) => {
  try {
    const data = await api.get(API_ROUTES.EVENT, {
      params: {
        locale,
        filters: {
          insertToPage: {
            id: {
              $eq: navigationId,
            },
          },
        },
        fields: [
          "name",
          "shortDescription",
          "description",
          "slug",
          "startDate",
          "endDate",
          "location",
          "organizer",
          "speakers",
        ],
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          tag: {
            fields: ["text", "color", "slug"],
          },
          insertToPage: {
            fields: ["text", "slug"],
          },
        },
      },
      next: {
        tags: ["event", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getDetailEventBySlug = async (
  locale: Locale,
  eventSlug: string
) => {
  try {
    const data = await api.get(API_ROUTES.EVENT, {
      params: {
        locale,
        filters: {
          slug: {
            $eq: eventSlug,
          },
        },
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          tag: {
            fields: ["text", "color", "slug"],
          },
          insertToPage: {
            fields: ["text", "slug"],
          },
          relatedEvents: {
            fields: [
              "name",
              "shortDescription",
              "slug",
              "startDate",
              "endDate",
              "location",
              "organizer",
              "speakers",
            ],
            populate: {
              thumbnail: {
                fields: ["url", "alternativeText", "width", "height"],
              },
            },
          },
        },
      },
      next: {
        tags: ["event", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getListEvent = async (locale: Locale) => {
  try {
    const data = await api.get(API_ROUTES.EVENT, {
      params: {
        locale,
        fields: ["slug"],
      },
      next: {
        tags: ["event", "tag", "navigation", "author"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getEducationalProgram = async (locale: Locale) => {
  try {
    const data = await api.get(API_ROUTES.EDUCATIONAL_PROGRAM, {
      params: {
        locale,
        populate: {
          insertToPage: {
            fields: ["slug"],
          },
        },
      },
      next: {
        tags: ["edu-program", "subject-type", "subject"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getDetailEducationalProgram = async (
  locale: Locale,
  slugEP: string
) => {
  try {
    const data = await api.get(API_ROUTES.EDUCATIONAL_PROGRAM, {
      params: {
        locale,
        filters: {
          insertToPage: {
            slug: {
              $eq: slugEP,
            },
          },
        },
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          blocks: {
            on: {
              "blocks.semester-block": {
                populate: {
                  semesters: {
                    populate: {
                      subjects: {
                        fields: ["name", "credits"],
                        populate: {
                          subjectType: {
                            fields: ["type", "color"],
                          },
                        },
                      },
                    },
                  },
                },
              },
              "elements.block-description": {
                populate: "*",
              },
            },
          },
          insertToPage: {
            fields: ["text", "slug"],
          },
        },
      },
      next: {
        tags: ["edu-program", "subject-type", "subject"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getSubjectType = async (locale: Locale) => {
  try {
    const data = await api.get(API_ROUTES.SUBJECT_TYPE, {
      params: {
        locale,
        fields: ["type", "color"],
      },
      next: {
        tags: ["subject-type"],
      },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};
