<div style="color:darkred">this blog is not complete yet, still to finish writing up</div>

# Cistercian Numerals Minecraft Banners

My repo: [https://github.com/JNCressey/Cistercian-Numerals-Minecraft-Banners](https://github.com/JNCressey/Cistercian-Numerals-Minecraft-Banners)

## Intro

Cistercian numerals are symbols that can represent the numbers 1-9999, invented by Cistercian monks in the early 13th century. 

This Numberphile video explains how they work: [Youtube: 
The Forgotten Number System - Numberphile](https://www.youtube.com/watch?v=9p55Qgt7Ciw)

They act as a compact version of base-10, with the four corners of the glyph representing the four digits. The order of the digits is like a backwards "Z" pattern with the top-right corner representing the units place. 

<figure>
	<!-- todo alt text -->
	<img src="examples/cistercian-numeral-forms.png" alt="">
	<figcaption>The form of each digit</figcaption>
</figure>

<figure>
	<!-- todo alt text -->
	<img src="examples/cistercian-numerals.png" alt="">
	<figcaption>Some examples of Cistercian numerals</figcaption>
</figure>

The compact design of the numerals can be useful in Minecraft. Usually, one way of showing numbers in Minecraft is to use banners, with one Arabic numeral per banner.

I designed a set of banner patterns that resemble a half of a Cistercian numeral, which allows two banners to represent a Cistercian numeral which is equivellent to four base-10 digits.

<figure>
	<!-- todo alt text -->
	<img src="examples/my-banners.png" alt="">
	<figcaption>Some examples of my Minecraft banners designs</figcaption>
</figure>



## Web-Browser Based Interactive Generator

I made a webpage that can generate the required banner patterns for an input number. I programmed it by writing javascript modules.

There is a core module which generates the data of the required sequence of banner patterns. I made this follow the below flowchart by splitting it into methods.
- I labelled each point of the main flowchart where flow converges.
	- From each, I wrote a method that starts at the labelled point and performs the actions and branching of the flowchart. But when it reaches another labelled point, it returns with a call for the corresponding next method.
- I made a method that implements the auxiliary flowchart, that the other main methods can use as an action for the relevant nodes of the flowchart.

I wrote a module that draws the result of what the Cistercian numeral is supposed to look like. It draws it on a canvas element. To draw each digit, I made a method that can be given an origin and set of directions so that it draws the digit with the correct rotation/reflection and position. It draws the digit by defining a square of four points and connecting the required points acording to the digit's face value.

I wrote a module that draws a preview of the banner on a canvas element. It iterates over the sequence of banner patterns, provided by the other module, and calls a function that draws that pattern step.

<!-- todo src -->
I'm hosting the interactive generator on Github Pages: [Cistercian Numerals Minecraft Banners Generator](https://jncressey.github.io/blogs/minecraft/cistercian-numerals-banners/interactive-generator.html)


## Flowchart

I made a flowchart so that a player can follow it as crafting instructions, without using the interactive generator, with just the flowchart images as references.

To use the flow chart, you first need to decide the digits you will make:

1. Choose a side of the numeral to make:
	- the hundreds and units
	- or the thousands and tens.
2. Choose two digits. Call them digit A and digit B.<br>With A being the larger digit, from their digit values, ignoring place value. (eg, for both 2080 and 8020: A=8 and B=2.)


Start at the top of the main flowchart.

When the main flowchart tells you to use the auxiliary flowchart, follow the steps on the other image for the single digit that the main flowchart told you to use. Then return to the main flowchart where you left from.

<details>
	<summary> Main flowchart </summary>
	<!-- todo alt text -->
	<img alt="Main flowchart" src="flowcharts/cistercian-numerals-main.png">
</details>

<details>
	<summary> Auxiliary flowchart </summary>
	<!-- todo alt text -->
	<img alt="Auxiliary flowchart" src="flowcharts/cistercian-numerals-auxiliary.png">
</details>


I used UMLet to draw the flowcharts.

---

*Minecraft is a trademark of Mojang/Microsoft. This site is not affiliated with or endorsed by Mojang or Microsoft.*
