var test_account = new account(1);
test_account.createMember("nolan");
test_account.createMember("nolan");
test_account.createMember("josh");
test_account.createTask("wash");
test_account.createTask("wash");
//test_account.assignTask("wash", "nolan");
//test_account.assignTask("wash", "nolan");
test_account.finishTask("wash", "nolan");
var nolan = test_account.getMember("nolan");
nolan.showCompletedTasks();