import { IWPCategory } from "@/types/category";
import { IWordpressPost } from "@/types/post";

export function getCategoryDetailsFromPost(post: IWordpressPost): IWPCategory[] {
  const categories: IWPCategory[] = [];
  if (post._embedded?.["wp:term"]) {
    for (const termGroup of post._embedded["wp:term"]) {
      // Loop through term groups [categories], [tags]
      if (termGroup && termGroup.length > 0 && termGroup[0].taxonomy === "category") {
        // If this group contains categories, add all to the categories array
        const categoryTerms = termGroup.filter(
          (term): term is IWPCategory => term.taxonomy === "category"
        );
        categories.push(...categoryTerms);
      }
    }
  }
  return categories;
}
