## Usage
```javascript

initSubscription({}) //returns a default subscription object if no parameters are supplied
isSubscriptionBillable(subscription) //returns a bool if its time to bill the subscription
getSubscriptionCost(subscription) //returns a int how much the subscription should pay
changeSubscriptionPlan(subscription, currentPlan, newPlan) //Changes one plan for another
updatePeriod(subscription, paid) // returns a updated subscription object

initPlan({}) //returns a default plan object if no parameters are supplied

```

## Plan model
```javascript

amount // The amount in öre to be charged on the interval specified.
created // Time at which the object was created. Measured in seconds since the Unix epoch.
currency // Three-letter ISO currency code, in lowercase
interval // One of day, week, month or year. The frequency with which a subscription should be billed.
intervalCount // The number of intervals (specified in the interval property) between each subscription billing. For example, interval=month and interval_count=3 bills every 3 months.
livemode
metadata
name // Display name of the plan.
statement_descriptor // Extra information about a charge for the customer’s credit card statement.
trial_period_days // Number of trial period days granted when subscribing a customer to this plan. Null if the plan has no trial period.

```

## Subscription model
```javascript

expirationDate
status
plans

```
