**1. How did I break down the problem before prompting?**

First I decided how I wanted the app to work: the features I wanted, written out, then the technical side like tech stack, whether it needed a database or a backend at all (it didn't).

Once the app was clear in my head, I turned that into a build plan: what to implement first, and what had to exist before something else could be built on top of it.

Then I built one feature at a time. Implement, test it myself, and only once it worked as expected would I look at whether the feature or the UX could be better. Iterate until it's good enough, then move on to the next one.

**2. What did the AI get wrong, and how did I fix it?**

**Checkpoint 1 — rearranging the UI broke "add category".** I caught it by testing whether the existing basic functionality still worked after the change. I asked the AI to investigate, read its explanation, and iterated until the original feature was working again *and* the UI improvement was kept.

**Checkpoint 2 — the due-date filter.** A category with no task matching the active filter (e.g. "overdue") still showed up, just empty. It should disappear entirely. Same approach: reproduce it, hand it over to investigate, review, iterate.

Overall: the pattern was that when the AI improves the UI/UX, it can unintentionally break core functionality. So I always test first to confirm the issue is real, then ask it to investigate, review the explanation, and iterate until the feature is back without losing the improvement.

**3. What did I deliberately not delegate to the AI?**

Testing, and the decisions about UX and design.

The AI can fix bugs and write tests, and it did both well. But I didn't hand over the final review and validation at any step. A change can look correct in isolation and still quietly break something that already worked, so I verified the app myself after every step and especially the features that existed before the change. For the simpler checks I tested on my own rather than asking the AI to, which also kept token usage down.

Design decisions I kept for the same reason, but a different one underneath: they're not about which behaviour is *correct*, they're about which one is convenient for the user. Two examples:

- **Layout.** After adding categories, the todos rendered below the forms, so the user had to scroll a long way to see them all which worse if there are more todos. I decided the forms belonged in a sidebar with the list beside them, and told the AI what to build.
- **Deleting a category.** Originally its todos fell into "Strays" (no category). I changed it: deleting a category sends its todos to the trash bin instead, and a deleted todo remembers the category it came from. On restore it goes back to that category if it still exists, and only falls back to Strays if it doesn't.

So: the AI implements and tests, I brainstorm the design and own the final review.

**4. What would I do differently with more time?**

I followed an iterative workflow: implement with AI, test, review, fix, then move on. With more time I'd make it more systematic: broader test coverage, and a deeper review of AI-generated changes, particularly where they touch functionality that already exists.
