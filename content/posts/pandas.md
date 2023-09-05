---
title: "Pandas"
date: 2023-08-28T17:54:30+09:00
draft: false
tags: ["python", "pandas"]
featured_image: "/images/pandas_svg.png"
---

## Introduction

Pandas is an open-source python data analysis library created by **Wes McKinney** for **quantitative finance** (hence it's name **pandas** from "PANel DAta System", an econometrics term for data sets that include observations over multiple time periods). It was initially released on January 11th, 2008 and continues to be one of the most popular python tools used when handing data sets nowadays.  


### Basic Building Blocks

1. 1 dimensional : Series, TimeSeries
    - Numpy array subclass with item label vector (Index)
    - Both ndarray and dict-like

2. 2 dimensional : DataFrame, DataMatrix
    - Represents a dict of Series objects
    - Conforms Series to a common Index

3. 3 dimensional : WidePanel, LongPanel -> Deprecated for multi-index
    - Behave as a dict of DataMatrix objects
    - Three indices: items, major_axis, minor_axis