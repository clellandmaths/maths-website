#!/usr/bin/env python3
"""
Tag Higher Maths past paper files with topic arrays.
Run from the website-v1/ directory:  python tag-higher.py
"""
import re
import os

# Topic tags: year → paper_number → list of topic arrays (one per question, in order)
TAGS = {
    2015: {
        1: [
            ["Perpendicular vectors and the scalar product"],
            ["Equation of a tangent to a curve"],
            ["Cubic/quartic expressions/equations: factorise or solve"],
            ["Identifying/sketching graphs of related functions (trigonometric)"],
            ["Inverse functions"],
            ["Simplify numerical expression involving logs/exponentials"],
            ["Differentiate or evaluate derivative: polynomial"],
            ["Quadratic inequations"],
            ["Angles and straight lines: m = tan\u03b8", "Perpendicular and parallel lines", "Collinearity (in 3d or 2d)"],
            ["Apply double angle formula to simplify or evaluate"],
            ["Equation of a tangent to a circle at a point", "Equation of a tangent to a curve"],
            ["Miscellaneous"],
            ["Graphs of logarithmic or exponential functions", "Identifying/sketching graphs of related functions (non-trigonometric)"],
            ["Miscellaneous"],
            ["Differential equation"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Intersection of straight lines"],
            ["Composite functions", "Completing the square", "Domain and range"],
            ["Find a specific term of a recurrence relation", "Limits of recurrence relations"],
            ["Areas using integration"],
            ["Intersections of two circles", "Circle equation from radius/centre or vice versa"],
            ["Using the distributive law with the scalar product", "Vector pathways in geometric diagrams", "Scalar product"],
            ["Integrate (definite or indefinite): trigonometric expression", "Apply double angle formula to simplify or evaluate", "Proving a trigonometric identity"],
            ["Optimisation"],
            ["Apply compound angle formula to simplify or evaluate", "Wave function (y = asin x \u00b1 bcosx)", "Trig equation involving compound angle"],
        ],
    },
    2025: {
        1: [
            ["Equation of a tangent to a curve"],
            ["Perpendicular and parallel lines"],
            ["Integrate (definite or indefinite): polynomial"],
            ["Simplify numerical expression involving logs/exponentials"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)"],
            ["Apply double angle formula to simplify or evaluate", "Apply compound angle formula to simplify or evaluate"],
            ["Cubic/quartic expressions/equations: factorise or solve"],
            ["Solving equations containing a logarithm"],
            ["Intersections of lines and circles (including showing tangency)"],
            ["Scalar product"],
            ["Discriminant and Quadratics", "Quadratic inequations"],
            ["Differential equation", "Integrate (definite or indefinite): trigonometric expression"],
            ["Find stationary points and determine nature", "Miscellaneous"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Intersection of straight lines"],
            ["Completing the square"],
            ["Areas using integration"],
            ["Inverse functions"],
            ["Collinearity (in 3d or 2d)", "Ratio in which one point divides two others"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Trig equation involving compound angle"],
            ["Integrate (definite or indefinite): (px + q)^n"],
            ["Vector pathways in geometric diagrams"],
            ["Find a specific term of a recurrence relation", "Limits of recurrence relations"],
            ["Optimisation"],
            ["Solving a trigonometric equation using formula for sin(2x)"],
            ["Composite functions", "Differentiate or evaluate derivative: composite function"],
            ["Solving equations where the unknown is in the exponent"],
            ["Circle equation from radius/centre or vice versa", "Intersections of two circles"],
        ],
    },
    2024: {
        1: [
            ["Angles and straight lines: m = tan\u03b8"],
            ["Find a specific term of a recurrence relation", "Limits of recurrence relations"],
            ["Differentiate or evaluate derivative: composite function"],
            ["Ratio in which one point divides two others"],
            ["Inverse functions"],
            ["Apply double angle formula to simplify or evaluate"],
            ["Intersections of lines and circles (including showing tangency)"],
            ["Quadratic inequations", "Discriminant and Quadratics"],
            ["Simplify numerical expression involving logs/exponentials"],
            ["Cubic/quartic expressions/equations: factorise or solve"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Identifying/sketching graphs of related functions (trigonometric)"],
            ["Find value of x for which a function has given gradient"],
            ["Altitudes, medians, perpendicular bisectors", "Miscellaneous", "Intersection of straight lines"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Intersection of straight lines", "Perpendicular and parallel lines"],
            ["Equation of a tangent to a curve"],
            ["Calculating an angle using the scalar product", "Scalar product"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)", "The graph of the derived function"],
            ["Integrate (definite or indefinite): trigonometric expression"],
            ["Deriving relationship y = ab^x or y = ax^b from straight line"],
            ["Areas using integration"],
            ["Composite functions", "Domain and range"],
            ["Find stationary points and determine nature", "Optimisation on a closed interval"],
            ["Circle equation from radius/centre or vice versa", "Intersections of two circles"],
            ["Solving equations where the unknown is in the exponent"],
            ["Solving a trigonometric equation using formula for sin(2x)"],
            ["Identify polynomial equation when shown graph/roots"],
        ],
    },
    2023: {
        1: [
            ["Differentiate or evaluate derivative: polynomial"],
            ["Altitudes, medians, perpendicular bisectors"],
            ["Solving equations containing a logarithm"],
            ["Apply compound angle formula to simplify or evaluate"],
            ["Discriminant and Quadratics"],
            ["Integrate (definite or indefinite): polynomial"],
            # Q7a + Q7b merged into one question object
            ["Simplify numerical expression involving logs/exponentials", "Graphs of logarithmic or exponential functions"],
            ["Find stationary points and determine nature"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)", "Inverse functions"],
            ["Cubic/quartic expressions/equations: factorise or solve", "Discriminant and Quadratics"],
            ["Integrate (definite or indefinite): trigonometric expression", "Areas using integration"],
            ["Completing the square"],
            ["Composite functions", "Solving a trigonometric equation using formula for sin(2x)"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Angles and straight lines: m = tan\u03b8"],
            ["Equation of a tangent to a curve"],
            ["Integrate (definite or indefinite): trigonometric expression"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)"],
            ["Differentiate or evaluate derivative: composite function"],
            ["Inverse functions"],
            ["Solving a trigonometric equation using formula for cos(2x)"],
            ["Areas using integration"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Identifying/sketching graphs of related functions (trigonometric)"],
            ["Find value of x for which a function has given gradient", "Quadratic inequations"],
            ["Circle equation from radius/centre or vice versa", "Intersections of two circles"],
            ["Differential equation"],
            ["Solving equations where the unknown is in the exponent"],
            ["Optimisation", "Deriving a formula"],
            ["Equation of a tangent to a circle at a point"],
        ],
    },
    2022: {
        1: [
            ["Perpendicular and parallel lines"],
            ["Simplify numerical expression involving logs/exponentials"],
            ["Inverse functions"],
            ["Differentiate or evaluate derivative: polynomial"],
            ["Angles and straight lines: m = tan\u03b8"],
            ["Integrate (definite or indefinite): (px + q)^n"],
            ["Apply compound angle formula to simplify or evaluate"],
            ["Solving equations containing a logarithm"],
            ["Solving a trigonometric equation using formula for cos(2x)"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)"],
            ["Completing the square"],
            ["Differentiate or evaluate derivative: trigonometric expression"],
            ["Cubic/quartic expressions/equations: factorise or solve", "Identifying/sketching graphs of related functions (non-trigonometric)"],
            ["Circle equation from radius/centre or vice versa", "Intersections of two circles", "Miscellaneous"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Intersection of straight lines"],
            ["Discriminant and Quadratics"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Trig equation involving compound angle"],
            ["Areas using integration"],
            ["Composite functions", "Quadratic inequations"],
            ["Differential equation"],
            ["Deriving relationship y = ab^x or y = ax^b from straight line"],
            ["Optimisation", "Deriving a formula"],
            ["Intersections of lines and circles (including showing tangency)", "Circle equation from radius/centre or vice versa"],
            ["Solving equations where the unknown is in the exponent"],
        ],
    },
    2019: {
        1: [
            ["Find stationary points and determine nature"],
            ["Discriminant and Quadratics"],
            ["Circle equation from radius/centre or vice versa"],
            ["Go backwards to find recurrence relation when terms known"],
            ["Collinearity (in 3d or 2d)", "Ratio in which one point divides two others"],
            ["Differentiate or evaluate derivative: composite function"],
            ["Perpendicular and parallel lines", "Angles and straight lines: m = tan\u03b8"],
            ["Areas using integration"],
            ["Perpendicular vectors and the scalar product", "Miscellaneous"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)"],
            ["Integrate (definite or indefinite): trigonometric expression"],
            ["Domain and range", "Composite functions"],
            ["Apply compound angle formula to simplify or evaluate"],
            # Q14a + Q14b merged into one question object
            ["Simplify numerical expression involving logs/exponentials", "Solving equations containing a logarithm"],
            ["Solving a trigonometric equation using formula for sin(2x)", "Miscellaneous"],
            ["Quadratic inequations", "Miscellaneous"],
            ["Proving a trigonometric identity", "Miscellaneous"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Intersection of straight lines"],
            ["Integrate (definite or indefinite): polynomial"],
            ["Ratio in which one point divides two others", "Basic vector paths (now in N5 maths)", "Vector pathways in geometric diagrams"],
            ["Write a recurrence relation formula from a real-life situation", "Limits of recurrence relations"],
            ["The graph of the derived function"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Trig equation involving compound angle"],
            ["Completing the square", "Increasing/decreasing: show that, or find values for which"],
            ["Inverse functions", "Domain and range"],
            ["Solving equations where the unknown is in the exponent"],
            ["Cubic/quartic expressions/equations: factorise or solve"],
            ["Deriving a formula", "Optimisation"],
            ["Deriving relationship y = ab^x or y = ax^b from straight line"],
            ["Differential equation"],
            ["Using the distributive law with the scalar product", "Calculating an angle using the scalar product"],
            ["Equation of a tangent to a circle at a point", "Circle equation from radius/centre or vice versa"],
        ],
    },
    2018: {
        1: [
            ["Altitudes, medians, perpendicular bisectors"],
            ["Inverse functions"],
            ["Differentiate or evaluate derivative: trigonometric expression"],
            ["Equation of a tangent to a circle at a point"],
            ["Ratio in which one point divides two others"],
            ["Simplify numerical expression involving logs/exponentials"],
            ["Points of intersection of polynomial(s) and/or straight line", "Equation of a tangent to a curve"],
            ["Angles and straight lines: m = tan\u03b8"],
            ["Vector pathways in geometric diagrams"],
            ["Differential equation"],
            ["Graphs of logarithmic or exponential functions", "Identifying/sketching graphs of related functions (non-trigonometric)", "Solving equations containing a logarithm"],
            ["Vector pathways in geometric diagrams", "Miscellaneous"],
            ["Apply double angle formula to simplify or evaluate", "Apply compound angle formula to simplify or evaluate"],
            ["Integrate (definite or indefinite): (px + q)^n"],
            ["Identify polynomial equation when shown graph/roots", "Increasing/decreasing: show that, or find values for which"],
        ],
        2: [
            ["Areas using integration"],
            ["Scalar product", "Calculating an angle using the scalar product"],
            ["Increasing/decreasing: show that, or find values for which"],
            ["Completing the square"],
            ["Altitudes, medians, perpendicular bisectors", "Intersection of straight lines", "Circle equation from radius/centre or vice versa"],
            ["Composite functions", "Solving a trigonometric equation using formula for cos(2x)"],
            ["Cubic/quartic expressions/equations: factorise or solve", "Find a specific term of a recurrence relation", "Limits of recurrence relations"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Identifying/sketching graphs of related functions (trigonometric)"],
            ["Optimisation"],
            ["Discriminant and Quadratics", "Quadratic inequations"],
            ["Solving equations where the unknown is in the exponent"],
            ["Circle equation from radius/centre or vice versa", "Intersections of two circles"],
        ],
    },
    2017: {
        1: [
            ["Composite functions"],
            ["Equation of a tangent to a circle at a point"],
            ["Differentiate or evaluate derivative: composite function"],
            ["Discriminant and Quadratics"],
            ["Scalar product"],
            ["Inverse functions"],
            ["Altitudes, medians, perpendicular bisectors"],
            ["Differentiate or evaluate derivative: polynomial"],
            ["Limits of recurrence relations", "Go backwards to find recurrence relation when terms known"],
            ["Areas using integration"],
            ["Perpendicular and parallel lines"],
            ["Solving equations containing a logarithm"],
            ["Integrate (definite or indefinite): (px + q)^n"],
            ["Wave function (y = asin x \u00b1 bcosx)", "Identifying/sketching graphs of related functions (trigonometric)"],
            ["Identifying/sketching graphs of related functions (non-trigonometric)", "Miscellaneous"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors", "Angles and straight lines: m = tan\u03b8", "Intersection of straight lines"],
            ["Cubic/quartic expressions/equations: factorise or solve"],
            ["Intersections of lines and circles (including showing tangency)"],
            ["Completing the square", "Differentiate or evaluate derivative: polynomial", "Increasing/decreasing: show that, or find values for which"],
            ["Ratio in which one point divides two others", "Calculating an angle using the scalar product", "Vector pathways in geometric diagrams"],
            ["Solving a trigonometric equation using formula for cos(2x)"],
            ["Find stationary points and determine nature", "Optimisation on a closed interval"],
            ["Find a specific term of a recurrence relation", "Quadratic inequations"],
            ["Deriving relationship y = ab^x or y = ax^b from straight line"],
            ["Collinearity (in 3d or 2d)", "Circle equation from radius/centre or vice versa"],
            ["Proving a trigonometric identity", "Integrate or differentiate non-standard function using given facts"],
        ],
    },
    2016: {
        1: [
            ["Perpendicular and parallel lines"],
            ["Differentiate or evaluate derivative: polynomial"],
            ["Find a specific term of a recurrence relation", "Limits of recurrence relations"],
            ["Circle equation from radius/centre or vice versa"],
            ["Integrate (definite or indefinite): trigonometric expression"],
            ["Inverse functions"],
            ["Vector pathways in geometric diagrams"],
            ["Intersections of lines and circles (including showing tangency)"],
            ["Find stationary points and determine nature", "Quadratic inequations", "Increasing/decreasing: show that, or find values for which"],
            ["Graphs of logarithmic or exponential functions"],
            ["Ratio in which one point divides two others", "Miscellaneous"],
            ["Composite functions", "Completing the square"],
            ["Apply compound angle formula to simplify or evaluate"],
            ["Simplify numerical expression involving logs/exponentials", "Solving equations containing a logarithm"],
            ["Identify polynomial equation when shown graph/roots", "Identifying/sketching graphs of related functions (non-trigonometric)"],
        ],
        2: [
            ["Altitudes, medians, perpendicular bisectors"],
            ["Discriminant and Quadratics"],
            ["Cubic/quartic expressions/equations: factorise or solve", "Areas using integration"],
            ["Intersections of two circles", "Circle equation from radius/centre or vice versa"],
            ["Calculating an angle using the scalar product"],
            ["Solving equations where the unknown is in the exponent"],
            ["Optimisation", "Deriving a formula"],
            ["Trig equation involving compound angle", "Wave function (y = asin x \u00b1 bcosx)"],
            ["Differential equation"],
            ["Integrate or differentiate non-standard function using given facts", "Differentiate or evaluate derivative: composite function"],
            ["Proving a trigonometric identity", "Integrate or differentiate non-standard function using given facts", "Differentiate or evaluate derivative: trigonometric expression"],
        ],
    },
}


def tag_file(filepath, year_tags):
    """Add topics arrays to each question in a Higher past paper JS file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if already tagged
    if "topics:" in content:
        print(f"  SKIPPED (already tagged): {filepath}")
        return 0

    # Build flat list of all topic arrays in paper order
    all_topics = []
    for paper_num in sorted(year_tags.keys()):
        all_topics.extend(year_tags[paper_num])

    # Find all timestamp lines
    pattern = r'(timestamp:\s*"[^"]*")'
    matches = list(re.finditer(pattern, content))

    if len(matches) != len(all_topics):
        print(f"  ERROR: {filepath} has {len(matches)} questions but {len(all_topics)} tags provided")
        return 0

    # Replace from end to start to preserve character positions
    for i in range(len(matches) - 1, -1, -1):
        match = matches[i]
        topics = all_topics[i]
        topics_str = ", ".join(f'"{t}"' for t in topics)

        # Detect indentation from the timestamp line
        line_start = content.rfind("\n", 0, match.start()) + 1
        indent = ""
        for ch in content[line_start:]:
            if ch in (" ", "\t"):
                indent += ch
            else:
                break

        replacement = f'{match.group(1)},\n{indent}topics: [{topics_str}]'
        content = content[: match.start()] + replacement + content[match.end() :]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  Tagged {len(matches)} questions: {filepath}")
    return len(matches)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Target: website-v1 only
    target_dir = os.path.join(script_dir, "src", "higher", "pastpapers")

    total = 0
    if not os.path.isdir(target_dir):
        print(f"Directory not found: {target_dir}")
        return

    for year, year_tags in sorted(TAGS.items()):
        filepath = os.path.join(target_dir, f"higherpastpaper{year}.js")
        if os.path.exists(filepath):
            total += tag_file(filepath, year_tags)
        else:
            print(f"  File not found: higherpastpaper{year}.js")

    print(f"\nDone! Tagged {total} questions.")


if __name__ == "__main__":
    main()
