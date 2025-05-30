//Q. Make an Expenses Report using the reduce method for summarizing expenses by category.

// The `reduce` method is used to accumulate values from an array into a single object that summarizes the total expenses for each category.

// let expenses = [
//     {description: "Groceries", amount: 50, category: "Food"},
//     {description: "Electricity Bill", amount: 100, category: "Utilities"},
//     {description: "Dinner", amount: 30, category: "Food"},
//     {description: "Internet Bill", amount: 50, category: "Utilities"},
// ]

// let expenseReport = expenses.reduce((report, expense) => {
//     report[expense.category] = (report[expense.category] || 0) + expense.amount;
//     return report
// }, {})

// console.log(expenseReport);




//Q. For the tasks that are not completed, sort them by priority

// Using the 'filter' method to get the tasks that are not completed, and then using the 'sort' method to sort them by priority.

// let tasks = [
//     {description: "Write report", completed: false, priority: 2},
//     {title: "Send email", completed: true, priority: 3},
//     {title: "Prepare presentation", completed: false, priority: 1},
// ];

// let incompleteTasks = tasks
//     .filter((task) => task.completed == false)
//     .sort((a,b) => a.priority - b.priority) // syntax for method chaining

// console.log(incompleteTasks);




// Q. Find the average movie rating of each of the following movies

// 

let movies = [
    {title: "Movie A", ratings: [4, 5, 3]},
    {title: "Movie B", ratings: [5, 5, 4]},
    {title: "Movie C", ratings: [3, 4, 2]}
];

let ratings = movies.map((movie) => {
    key = movie.title;
    rating = movie.ratings;
    total = 0;
    for(i = 0; i < rating.length; i++){
        total = rating[i] + total;
    }
    return {"title": key, finalRating: (total/rating.length).toFixed(2)}
})

console.log(ratings);