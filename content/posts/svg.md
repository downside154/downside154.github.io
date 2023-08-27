---
title: "SVG(Scalable Vector Graphics)"
date: 2023-08-27T14:48:47+09:00
draft: false
tags: ["FE"]
---


## Introduction

## Deep dive into SVG

SVG code for an icon is usually made up of a bunch of `path` elements with `d` attribute(aka. path data).

{{< figure src="/images/svg_heart_vector.png" width="400px">}}


### Path Data

The `d` attribute is a series of commands that tell the browser how the path should be drawn.
Below is an example of a `d` attribute cleaned up: 

{{< figure src="/images/svg_heart_drawing1.png" width="800px">}}

All path commands follow the same basic syntax - a single letter code followed by a series of numbers. The letter code identifies the command type, while the numbers act as the command's parameters.

```byte
M - move
C - cubic curve 
L - line
Z - close path
```

In some ways , the commands can be seen as function calls where the letter code is the function name and the numbers are the function's arguments. 


### Absolute and Relative Commands

The command code can be either **uppercase** or **lowercase**.

1. Uppercase - commands are **absolute**. Their parameters are relative to the origin point `(0,0)`
2. Lowercase - commands are **relative**. Their parameters are relative to the previous command's endpoint.

{{< figure src="/images/svg_absolute_line.png" width="600px">}}


---
---

## Commands


### Cursors

All path commands use the cursor to determine where to start drawing from, and all path commands move the cursor to ensure the following command starts from the correct position.

{{< figure src="/images/svg_cursor.png" width="600px">}}

Where the current path section ends depends on whether the command is absolute or relative. For **absolute commands**, the cursor will end up at the command's `x` and `y` values. For **relative commands**, the cursor will end up at the cursor's current position plus the command's `dx` and `dy` values. 

#### Move Command

The move command is a special command that only moves the cursor without drawing, denoted with the `M` or `m` code and are used when drawing paths that aren't connected to one another.

---

### Lines
Lines lets you draw in a straight line using `L` or `l`.

#### Vertical or Horizontal Lines

The `H` and `V` commands allows you to draw horizontal or vertical lines. 

#### Close Path

The Close Path command `Z` draws a straight line from the current cursor position to the start of the path and does not take any arguments. 

```
M 5.0 10.0
l 2.5 -5.0
h 10.0 
l 2.5 5.0
h -12.5
v 10.0
h 5.0
v -5.0
h -2.5
v 5.0
h 7.5
v -10.0
Z
```

{{< figure src="/images/svg_lines2.png" width="600px">}}



---


### Bezier Curves

There are three types of curves you can draw using SVG paths: **quadratic bezier curves**, **cubic bezier curves**, and **arcs**.

A bezier curve is a curve that is defined by a series of points known as **control points**. Quadratic bezier curves have one control point while cubic bezier curves have two control points.

{{< figure src="/images/svg_bezier1.png" width="600px">}}


#### Quadratic Curves

While cubic bezier curves are more flexible, quadratic bezier curves are simpler to write, making them preferable when you don't need the extra shape.

The `Q` command lets you draw a quadratic bezier curve:
```
Q controlX controlY endX endY
```

##### Chaining Quadratic Curves 

In order to get the following shape below:


{{< figure src="/images/svg_chain_quadratic.png" width="600px">}}


you could write the following :
```
Q 5 10 10 10
Q 15 10 15 15
```

There's an easier way using the `T` command: 
```
M 5 5
Q 5 10 10 10
T 15 15
```
The `T` command will draw a new quadratic curve using the reflection of the previous curve's control point. The first `Q` command will change the shape of the second one for obvious reasons.


#### Cubic Curves

Cubic Curves have an additional control point that makes it easier to manipulate the shape of the curve. Cubic curves uses the `C` command and is used as follows:
```
C x1 y1 x2 y2 x y
```
{{< figure src="/images/svg_cubic1.png" width="800px">}}

##### Chaining Cubic Curves

Just like how quadratic curves uses the `T` command, cubic curves use the `S` command to chain two cubic curves. 

```
S x1 y2 x y
```
Example: 

{{< figure src="/images/svg_cubic2.png" width="800px">}}

---


### Arcs

The arc command lets you draw a section of an ellipse using the `A` command as follows:

```
A rx ry rotation large-arc-flag sweep-flag x y
```

`(rx, ry)` and `(x,y)` determine the ellipse that the arc is drawn on.

To draw an arc, the browser will take these three points and tries to find and ellipse that 'fits'; meaning an ellipse with radii `rx` and `ry` and with both of the points on its circumference.

```
M 3 10
A 10 7.5 0 0 0 20 17
```
{{< figure src="/images/svg_arc1.png" width="800px">}}

However, it is not always possible to find a matching ellipse. When the ellipse isn't big enough to fit the arc's points, the arc isn't affected, it still follows the ellipse's curve. **The ellipse is implicitly scaled to fit the arc.**

{{< figure src="/images/svg_arc2.png" width="800px">}}

#### X-Axis rotation

the x-axis-rotation rotates the ellipse around its `x` or horizontal axis.

Example: 
```
A 10 7.5 39.5 0 0 20 17
```

{{< figure src="/images/svg_arc3.png" width="800px">}}


#### Large Arc and Sweep Flags 

They are flags, meaning they can only be `0` or `1`. 


When the browser tries to find an ellipse that fits the arc's points and draws the curve on the ellipse, there can actually be four possible curve sthat can be drawn between any pair of points.

{{< figure src="/images/svg_arc4.png" width="800px">}}


Two of the arcs are drawn **clockwise**: 
{{< figure src="/images/svg_arc5.png" width="800px">}}


Two of the arcs are drawn **counter-clockwise**: 
{{< figure src="/images/svg_arc6.png" width="800px">}}

1. **Sweep** - controls which of these two directions is drawn, with `0` meaning *counter-clockwise*. 
2. **Large-Arc** - controls which of the two arcs is chosen, with `0` meaning the smaller arc.

**note** if the ellipse happens to be a perfect circle (when rx === ry), then the large arc flag has no effect.

----

## Source

source link: (Understanding SVG Paths)[https://www.nan.fyi/svg-paths]
