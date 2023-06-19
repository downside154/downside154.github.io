---
title: "First Post"
date: 2023-02-17T16:18:35+09:00
tags: ["intro", "markdown", "hugo"]
featured_image: "/images/spiderman1.jpg"
omit_header_text: true
---


## Introduction : Test Post

As the first post of this blog. It seems only fitting that this be the place where I test out the features of Hugo.


### Testing


This is **bold** text, and this is *emphasized* text.


Table
|test1   |test2   |test3   |test4   |test5   |
|---|---|---|---|---|
|  6 |  7 |  8 | 9  | 10  |
|  11 | 12  | 13  | 14  | 15  |

-------

- [ ] checking if extended markdown ~~works~~.
- [x] ==yea== it~does~ work^2^ :joy:
- [ ] highlight, subscript, superscript, emoji markdown not working

Trie code in python
```python
   class TrieNode:
       """A node in the trie structure"""
       def __init__(self, char):
           self.char = char
           self.is_end = False
           self.counter = 0
           self.children = {}
       class Trie:
       """The trie object"""
       def __init__(self):
           self.root = TrieNode("")
       
       def insert(self, word):
           node = self.root
           for char in word:
               if char in node.children:
                   node = node.children[char]
               else:
                   new_node = TrieNode(char)
                   node.children[char] = new_node
                   node = new_node
           node.is_end = True
           node.counter += 1
       
       def dfs(self, node, prefix):
           if node.is_end:
               self.output.append((prefix + node.char, node.counter))
           for child in node.children.values():
               self.dfs(child, prefix + node.char)
       
       def query(self, x):
           self.output = []
           node = self.root
           for char in x:
               if char in node.children:
                   node = node.children[char]
               else:
                   return []
           self.dfs(node, x[:-1])
           return sorted(self.output, key=lambda x: x[1], reverse=True)

```

```python
   t = Trie()
   t.insert("was")
   t.insert("word")
   t.insert("war")
   t.insert("what")
   t.insert("where")
   print(t.query("wh"))
   # Output: [('what', 1), ('where', 1)]
```

Visit the [Hugo](https://gohugo.io) website!

testing image rendering:
1. ![image_test](/static/images/spiderman1.jpg) doesnt seem to be working.. prob an issue with src
2. ![image2](https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg)
3. {{< figure src="/images/spiderman1.jpg" title="spiderman logo image render at 300px" width="600px">}}
