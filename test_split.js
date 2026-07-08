const item = { title: "BIBLE INFOGRAPHICS", link: "/bible-resources/infographics" };
const id = item.link ? item.link.split('/').filter(Boolean).pop() || item.id?.toString() : item.id?.toString();
console.log("ID for infographics:", id);

const item2 = { title: "MISSIONARY STORIES", link: "/bible-resources/missionary-story/" };
const id2 = item2.link ? item2.link.split('/').filter(Boolean).pop() || item2.id?.toString() : item2.id?.toString();
console.log("ID for missionary-story:", id2);
