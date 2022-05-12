<?php
     header("Access-Control-Allow-Origin: *");
    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.

        $args = json_decode(file_get_contents("php://input"));

        $name = strip_tags(trim($args->name));
		$name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($args->email), FILTER_SANITIZE_EMAIL);
        $phone = strip_tags(trim($args->phone));
        $message = trim($args->message);

        // Check that data was sent to the mailer.
        if ( empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "Oops! There was a problem with your submission. Please complete the form and try again.";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "adan.archila@gmail.com";

        // Set the email subject.
        $subject = "New contact from $name";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Phone: $phone\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From: $name <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            echo "Thank You! Your message has been sent.";
        } else {
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        echo "There was a problem with your submission, please try again.";
    }

?>