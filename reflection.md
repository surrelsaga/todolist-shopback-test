**1. How did I break down the problem before prompting?**

I will need to decide how I want the app to works. Specifically, what features I want to have in mind, write it out. After that, I will decide the technical stuffs like tech stack (using a database or not, or need to build backend or not).

After I got a clear idea of how the app works, I will set up a building plan. What features to implement first, what needs to be done before the others.

Then, I will start building one feature at a time. I will do some testings to see if it works, only if it does work as I expect, I will see if I want to improve the UX or the feature and iterate until I got it. If it's already good enough, I will move on

**2. What did the AI get wrong, and how do you fix it?**

Checkpoint 1: When I told it to rearrange the overall UI, it broke the add 'category' feature. I noticed the issue while testing if the implemented basic functionality still exists. I then asked AI to investigate the issue, reviewed its explanation and iterate until the original feature worked again while keeping the UI improvement. 

Checkpoint 2: Adding 'due-date filter' feature. The category that doesn't have any todo that falls under a specific filter (e.g: 'Overdue') would still show up with no todos inside. Preferably, it shouldn't show up. so did the same thing investigate,...

**3. What did you deliberately not delegate to AI, and why?**

Testing, and making decisions about how to improve UI, UX or fix a bugs. AI can fix the bug. But reviewing and testing I won't let AI do 100%, I need to test to see if any improvement need to be made or any possible bugs.

Checkpoint 1: When I'm done with my step 2 adding the 'category' features to group todo tasks. I realized the UI was like, the todos are added below the form to create categories and todos. User will have to scroll down a lot to see all the todos which is not convenient, especially when there might be a lot of todos.

Checkpoint 2

In most of every building steps: I intentionally did not delete the final review and validation to AI. although AI was able to implement most of the features effectively and writing tests to check if it working. I wanted to personally verify that the application still behave as expected, especially the features that existed before my changes.
=> reason: AI can make changes that look correct in isolation but might unintentionally affect existing functionality


For some simple testing, I will do test on my own so token usage is optimized.



**4. What would you do differently with more time?**

I was focusing abit too much on improving the UI and waste some time. Should have focus finish all the basic functionality all the way first then improve the UI
Add searching engine
todos are draggable
