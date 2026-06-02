<?php
date_default_timezone_set('Europe/Moscow');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
    exit;
}

function field_value($name) {
    return trim(filter_input(INPUT_POST, $name, FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
}

$data = [
    'Имя' => field_value('name'),
    'Компания' => field_value('company'),
    'Телефон' => field_value('phone'),
    'E-mail' => field_value('email'),
    'Требуемая мощность' => field_value('power'),
    'Комментарий' => field_value('message'),
];

if ($data['Телефон'] === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Укажите номер телефона']);
    exit;
}

$rows = '';
foreach ($data as $label => $value) {
    if ($value === '') {
        continue;
    }
    $rows .= '<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">' . $label . '</td><td style="padding:8px 12px;border:1px solid #ddd;">' . $value . '</td></tr>';
}

$message = '<html><body style="font-family:Arial,sans-serif;">'
    . '<h2 style="color:#e31d2f;">Заявка на подбор ДГУ CNC Energy</h2>'
    . '<p><strong>Дата:</strong> ' . date('d.m.Y H:i:s') . '</p>'
    . '<table style="border-collapse:collapse;">' . $rows . '</table>'
    . '</body></html>';

$to = 'dsl@cncrussia.com';
$subject = '=?UTF-8?B?' . base64_encode('Заявка на подбор ДГУ CNC Energy') . '?=';
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'cnc-energy.ru') . "\r\n";

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Заявка отправлена']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Не удалось отправить письмо']);
}
