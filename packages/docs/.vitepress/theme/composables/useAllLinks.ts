import type { Ref } from 'vue';
import { ref, unref } from 'vue';
import { useData, withBase } from 'vitepress';
import { withLeadingCharacters } from '@studiometa/js-toolkit';

interface Link {
  text: string;
  link: string;
  parent?: Link;
  root?: Link;
}

interface VitepressLink {
  text: string;
  link?: string;
  children?: VitepressLink[];
}

/**
 * Add links to the list of links.
 */
function addLinks(
  links: Ref<Link[]>,
  linksSet: Set<string>,
  item: VitepressLink,
  parent?: VitepressLink,
  root?: VitepressLink,
) {
  if (item.link) {
    let { text, link } = item;
    link = withBase(link);

    if (!linksSet.has(text + link)) {
      const newLink:Link = {
        text,
        link: link,
      };

      if (parent) {
        newLink.parent = {
          text: parent.text,
          link: withBase(parent.link)
        }
      }

      if (root) {
        newLink.root = {
          text: root.text,
          link: withBase(root.link)
        };
      }

      links.value.push(newLink);
      linksSet.add(text + link);
    }
  }

  if (Array.isArray(item.children)) {
    item.children.forEach((child) => addLinks(links, linksSet, child, item, parent));
  }
}

export function useAllLinks() {
  const { theme } = useData();
  const { nav, sidebar } = unref(theme);

  const links = ref([]);
  const linkSet = new Set();

  nav.forEach((item) => addLinks(links, linkSet, item));

  Object.entries(sidebar).forEach(([name, item]) => {
    const parent = nav.find(item => name.startsWith(item.link));
    item.forEach((link) => addLinks(links, linkSet, link, parent));
  });

  return {
    links,
  };
}
