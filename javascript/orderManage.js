$(function(){
	/*
	$("#startTime").on('click',function(){
		$("#startTime").datepicker();
	});

	$("#endTime").on('click',function(){
		$("#endTime").datepicker();
	});

	$("#startTime").click();
	$("#endTime").click();
	*/

	$('body').on('focus', '#startTime', function(){
		$(this).datepicker();
	});
	
	$('body').on('focus', '#endTime', function(){
		$(this).datepicker();
	});
});