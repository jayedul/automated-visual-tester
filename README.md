### AV Tester - WordPress Automation
An automated testing plugin for WordPress CMS that simulates basic user interactions on browser without any crazy setup.

To run automated tests, all you have to do is define a series of events in AVT dashboard.

### Developer Documentation
AV Tester triggers all the events through jQuery **trigger** method. You can identify whether the event is triggered by AVT or not in following way. 
<pre>
$('#selector').click(function(e, d) {
    var is_avt = (d || {}).avt_event == true;
    console.log(is_avt);
});
</pre>
By default AVT waits for ajax requests initiated by only jQuery that starts immediately after events like **click**.
If you use other request package then just increment/decrement <code>window.avt_ajax_counter</code> global variable on request start/complete.

### Limitations
Drag & Drop is a complex user interaction that can't be simulated at this moment. 