function downloadAttachments() {
    // Replace with the email address you want to filter by
    var targetEmail = 'noreply@swiggy.in';

    var startDate = '2023-09-02'; // yyyy-mm-dd
    var endDate = '2023-09-15';
    var driveFolderId = '';

    var searchString =
        'in:spam from:' +
        targetEmail +
        ' after:' +
        startDate +
        ' before:' +
        endDate;

    console.log(searchString);

    // Get the Gmail inbox
    var threads = GmailApp.search(searchString);
    console.log('Matching entries:', threads.length);

    // Search for emails from the target email address
    // var threads = GmailApp.search("from:" + targetEmail);

    // Iterate through the threads
    for (var i = 0; i < threads.length; i++) {
        var thread = threads[i];

        // Get all messages in the thread
        var messages = thread.getMessages();

        // Iterate through the messages
        for (var j = 0; j < messages.length; j++) {
            var message = messages[j];

            // Check if the message has attachments
            if (message.getAttachments().length > 0) {
                // Iterate through the attachments
                var attachments = message.getAttachments();
                for (var k = 0; k < attachments.length; k++) {
                    var attachment = attachments[k];

                    // Download the attachment
                    var attachmentBlob = attachment.copyBlob();

                    // You can save the attachment to Google Drive or locally
                    // For example, to save to Google Drive
                    console.log('adding..');
                    var folder = DriveApp.getFolderById(driveFolderId);
                    folder.createFile(attachmentBlob);

                    // To save locally, you can use DriveApp or other methods
                    // For example:
                    // attachmentBlob.setName(attachment.getName());
                    // var file = DriveApp.createFile(attachmentBlob);
                }
            }
        }
    }
}
