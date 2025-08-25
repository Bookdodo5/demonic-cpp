export default {
  "title": "Q3: Loops",
  "questions": [
    {
      "id": 1,
      "question": "What do curly braces with nothing inside mean when placed directly after a while loop statement? Ex. while(condition) {}",
      "options": [
        "Empty block without inner statements",
        "Skip the while loop",
        "Execute regardless of condition",
        "Wrong syntax (compile error)"
      ],
      "correctAnswer": 0,
      "explanation": "The curly braces {} define a scope or a block of code. When they are empty, the loop will still check the condition and run, but it will do nothing in its body for each iteration. This is valid C++ syntax and is sometimes used intentionally, for example, to wait for a condition to become true."
    },
    {
      "id": 2,
      "question": "What happens when the variable 'i' that is declared in the initialization of for loop is declared again inside the for loop body?",
      "options": [
        "The new variable replaces the previously declared variable",
        "The new variable exists only in the scope of the loop body",
        "Runtime Error",
        "Compile Error"
      ],
      "correctAnswer": 3,
      "explanation": "Names declared in the scope of initialization and condition can be shadowed in the scope of statement in C, but it is forbidden in C++. This will results in compile error \"error: redeclaration of 'int i'\""
    },
    {
      "id": 3,
      "question": "What is the final value of a?",
      "codeBlock": `#include <iostream>

int main() {
    int a = 420;
    for (a; a; --a) {
        // empty
    }
}`,
      "options": [
        "-1",
        "0",
        "1",
        "Compile Error"
      ],
      "correctAnswer": 1,
      "explanation": "The loop will execute for a = 420, 419, ..., 1. When a is 1, the loop runs one last time, and then --a makes a equal to 0. The condition a (now 0) is evaluated as false, and the loop terminates. The final value of a is 0."
    },
    {
      "id": 4,
      "question": "Which of these is not valid inside the parentheses of for loop?",
      "options": [
        "for(;;)",
        "for(int i = 0; i < 10;)",
        "for(char i = 'a', j = 'b'; i < j; i = j)",
        "for(i; j < 3; k++;)"
      ],
      "correctAnswer": 3,
      "explanation": "for(i; j < 3; k++;) is invalid because of the semicolon after k++. The third part of a for loop's header expects an expression, not a statement. k++ is an expression, but k++; is a statement. This results in a syntax error."
    },
    {
      "id": 5,
      "question": "What will be printed to the console?",
      "codeBlock": `#include <iostream>

int main() {
    int val = 1;
    for (int val = 2; val < 4; val++)
        std::cout << val;
        std::cout << val;
}`,
      "options": [
        "2341",
        "2233",
        "231",
        "341"
      ],
      "correctAnswer": 2,
      "explanation": `The for loop declares a val variable, which is a different variable from the val = 1 of the main scope. This new val is only visible inside the scope of the for loop and shadows the outer val.

Since there are no curly braces {}, only the very next statement (std::cout << val;) is part of the loop's body.

The first std::cout prints out 2 and 3 of inner val, then the second std::cout prints out the initial val = 1 from the main scope.
`
    },
    {
      "id": 6,
      "question": "How can you solve the problem of infinite loop in this code?",
      "codeBlock": `#include <iostream>

int main() {
    int start = 0, end = 10;
    while(start < end) {
        int divide = start + (end - start) / 3;
        
        if(divide < 7) {
            start = divide;
        }
        else {
            end = divide;
        }
    }
    std::cout << start;
}`,
      "options": [
        "Change the condition of while loop to 'start <= end'",
        "Add an if statement to execute 'break' command when divide == 7",
        "Change the statement inside the else block to 'end = divide + 1;'",
        "Add semicolon after the condition of while loop."
      ],
      "correctAnswer": 1,
      "explanation": `Initial: (0, 10) -> divide = 3 -> start = 3. State is (3, 10).
State: (3, 10) -> divide = 5 -> start = 5. State is (5, 10).
State: (5, 10) -> divide = 6 -> start = 6. State is (6, 10).
State: (6, 10) -> divide = 7 -> end = 7. State is (6, 7).

State: (6, 7) -> divide = 6 + (7 - 6) / 3 = 6 + 0 = 6. divide < 7 is true, so start is set back to 6. The state remains (6, 7).
The loop is now stuck because start and end will never change again, and the condition start < end (6 < 7) will always be true.

The infinite loop occurs when divide is equal to 7, so breaking out of the loop when divide is equal to 7 will fix the infinite loop.`
    },
    {
      "id": 7,
      "question": "What will be printed to the console?",
      "codeBlock": `#include <iostream>

int main() {
    int val = 3;
    int i = 10;
    do {
        int i = 5;
        std::cout << i << " ";
    } while (i-- && val--);
}`,
      "options": [
        "5 5 5 5",
        "10 10 10 10",
        "5 4 3 2",
        "10 9 8 7"
      ],
      "correctAnswer": 0,
      "explanation": `The scope of condition inside the parentheses of do-while loop is the same as outside the loop body, meaning that the condition uses the 'i' and 'val' of the main scope, while the std::cout always uses the new 'i = 5' declared inside the loop body.

Each time condition is checked, 'val' and 'i' will decrease by 1. The first variable to go to zero is 'val' after decrementing 3 times.

And since the do-while loop always execute once before checking the condition, the total count of std::cout execution is 4 times.`
    },
    {
      "id": 8,
      "question": "How many times will 'X' be printed?",
      "codeBlock": `#include <iostream>

int main() {
    int i = 0;
    while (i < 10) {
        std::cout << "X";
        if (i % 2 == 0) continue;
        if (i == 8) break;
        i++;
    }
}`,
      "options": [
        "4",
        "5",
        "8",
        "Infinite Loop (continue printing forever)"
      ],
      "correctAnswer": 3,
      "explanation": "The first loop starts with i equals to 0, which prints \"X\" 1 times. Then it enters the condition of (i % 2 == 0), and execute the continue statement. This restarts the loop without incrementing i, resulting in the exact same condition as the first time, thus infinite loop."
    },
    {
      "id": 9,
      "question": "What is the output of this nested loop?",
      "codeBlock": `#include <iostream>

int main() {
    for (int i = 0; i < 3; i++) {
        for (i = 0; i < 3; i++) {
            std::cout << i << " ";
        }
    }
}`,
      "options": [
        "Compile Error",
        "0 1 2",
        "0 1 2 0 1 2 0 1 2",
        "Infinite Loop (continue printing forever)"
      ],
      "correctAnswer": 1,
      "explanation": "The outer loop declares i as 0, then the inner loop executes, printing '0 1 2'. After that, the final value of i is 3, which doesn't meet the condition of the outer loop, so the loop terminates, stopping the program."
    },
    {
      "id": 10,
      "question": "Which choice is NOT equivalent to this code when i is previously initialized as some value?",
      "codeBlock": `do {
    std::cout << ".";
    i++;
} while (i < 3);`,
      "options": [
        `while (1) {
    if(!(i < 3)) break;
    std::cout << ".";
    i++;
}`,
        `while (1) {
    std::cout << ".";
    i++;
    if(!(i < 3)) break;
}`,
        `bool hasRun = false;
for(i; i < 3 || !hasRun; i++) {
    hasRun = true;
    std::cout << ".";
}`,
        `do {
    std::cout << ".";
    i++;
    if(i < 3) continue;
    break;
} while (1);`
      ],
      "correctAnswer": 0,
      "explanation": "The do-while loop always execute its content regardless of the initial condition. The while loop of the first option can terminates before executing the std::cout if the value of i matches the condition, therefore different from the do-while loop of the code block."
    }
  ]
};