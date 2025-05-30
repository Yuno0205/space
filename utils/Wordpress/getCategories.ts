import { IWPCategory } from "@/types/category";
import { IWordpressPost } from "@/types/post";

export function getCategoryDetailsFromPost(post: IWordpressPost): IWPCategory[] {
  const categories: IWPCategory[] = [];
  if (post._embedded && post._embedded["wp:term"]) {
    for (const termGroup of post._embedded["wp:term"]) {
      // Lặp qua các nhóm [categories], [tags]
      if (termGroup && termGroup.length > 0 && termGroup[0].taxonomy === "category") {
        // Nếu nhóm này là category, thêm tất cả vào mảng categories
        categories.push(...(termGroup as IWPCategory[]));
      }
    }
  }
  return categories;
}
