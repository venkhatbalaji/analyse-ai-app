import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:telephony/telephony.dart';
import 'package:logger/logger.dart';
import 'package:workmanager/workmanager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Top-level function for Workmanager callback
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    final telephony = Telephony.instance;
    final logger = Logger();

    bool? permissionsGranted = await telephony.requestSmsPermissions;

    if (permissionsGranted != null && permissionsGranted) {
      List<SmsMessage> messages = await telephony.getInboxSms();
      for (SmsMessage message in messages) {
        String body = message.body ?? '';
        print("Message: " + body);
        if (body.contains(RegExp(r'credit|debit', caseSensitive: false))) {
          double? amount = extractAmount(body);
          if (amount != null) {
            await sendToApi(body, amount);
          }
        }
      }
    }

    return Future.value(true); // Indicate success
  });
}

// Helper functions
double? extractAmount(String body) {
  RegExp regExp = RegExp(r'(\d+(?:\.\d{1,2})?)');
  Match? match = regExp.firstMatch(body);
  if (match != null) {
    return double.parse(match.group(0)!);
  }
  return null;
}

Future<void> sendToApi(String message, double amount) async {
  const String apiUrl = 'http://192.168.0.142:8000/api/v1/ai/messages';

  final response = await http.post(
    Uri.parse(apiUrl),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'messages': [message],
      'userId': "123e4567-e89b-12d3-a456-426614174000",
    }),
  );

  if (response.statusCode == 201) {
    print("Message sent successfully");
  } else {
    print("Failed to send message");
  }
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  Workmanager().initialize(callbackDispatcher);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Expense Analyzer',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue.shade500),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Expense Analyzer'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  List<dynamic> _expenses = [];
  final Telephony telephony = Telephony.instance;
  final logger = Logger();

  Future<void> fetchExpenses() async {
    try {
      const String apiUrl =
          'http://192.168.0.142:8000/api/v1/ai/123e4567-e89b-12d3-a456-426614174000'; // Update with your API endpoint
      final response = await http.get(Uri.parse(apiUrl));
      print(response.statusCode);
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          _expenses = data;
        });
      } else {
        logger.e("Failed to load expenses");
      }
    } catch (e) {
      logger.e("Error fetching expenses: $e");
    }
  }

  List<dynamic> getTodayExpenses() {
    print(_expenses);
    return _expenses.toList();
  }

  @override
  void initState() {
    super.initState();
    requestSmsPermission();
    scheduleSmsBackgroundTask();
  }

  Future<void> requestSmsPermission() async {
    PermissionStatus status = await Permission.sms.request();
    if (status.isGranted) {
      logger.i("SMS permission granted");
    } else {
      logger.w("SMS permission denied");
    }
  }

  void scheduleSmsBackgroundTask() {
    Workmanager().registerOneOffTask(
      "smsFetchTask",
      "smsFetchTask",
      initialDelay: Duration(minutes: 1), // Adjust the initial delay as needed
    );
  }

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    final todayExpenses = getTodayExpenses();
    print(todayExpenses);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: todayExpenses.isEmpty
            ? Text('No expenses for today.')
            : ListView.builder(
                itemCount: todayExpenses.length,
                itemBuilder: (context, index) {
                  final expense = todayExpenses[index];
                  return ListTile(
                    title: Text(expense['transactions'][0]['vendor']),
                    subtitle: Text(
                        '${expense['transactions'][0]['amount']} ${expense['transactions'][0]['category']}'),
                    trailing: Text(expense['transactions'][0]['date']),
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: fetchExpenses,
        tooltip: 'Refresh',
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
