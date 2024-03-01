<template>
	<head>
		<meta charset="utf-8">
		<title>登录页面</title>
	</head>

	<body>
		<form>
			<table>
				<tr>
					<td>用户名：</td>
					<td><input id="username" /></td>
				</tr>

				<tr>
					<td>密&emsp;码：</td>
					<td><input id="password" /></td>
				</tr>

				<tr>
					<td><button type="button" id="login">登录</button></td>
					<td><input type="reset" value="重置" /></td>
				</tr>
			</table>
		</form>


	</body>


</template>

<script>
	$("#login").click(function() {
		let username = $("#username").val();
		let password = $("#password").val();

		$.post("http://localhost:8082", {
			"username": username,
			"password": password
		}, function(response) {
			if (response.code === 200) {
				location.href = "http://www.baidu.com";
			} else {
				alert(response.message);
			}
		});
	});
</script>
<style scoped>

</style>
