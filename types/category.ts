export interface IWPTermBase {
  id: number;
  name: string;
  slug: string;
  link: string;
  taxonomy: "category" | "post_tag" | string;
}

export interface IWPCategory extends IWPTermBase {
  taxonomy: "category";
}

export interface IWPTag extends IWPTermBase {
  taxonomy: "post_tag";
}
