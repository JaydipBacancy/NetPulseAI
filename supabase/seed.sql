insert into public.network_nodes (
  id,
  site_code,
  name,
  region,
  vendor,
  node_type,
  network_slice,
  status,
  software_version,
  availability_pct,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000101', 'BLR-UPF-07', 'Bengaluru UPF 07', 'South', 'Nokia', 'UPF', 'eMBB-Enterprise', 'online', '23.11R1', 99.97, '2026-03-12T02:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000102', 'DEL-GNB-11', 'Delhi gNodeB 11', 'North', 'Ericsson', 'gNodeB', 'URLLC-Telemedicine', 'degraded', '24.Q1.3', 98.12, '2026-03-12T02:05:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000103', 'HYD-CORE-03', 'Hyderabad Core 03', 'South', 'Samsung', '5G Core', 'mMTC-SmartGrid', 'online', '25.1.0', 99.91, '2026-03-12T02:10:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000104', 'MUM-RAN-09', 'Mumbai RAN 09', 'West', 'Nokia', 'RAN Cluster', 'eMBB-Consumer', 'offline', '23.9R3', 94.63, '2026-03-12T02:15:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000105', 'CHN-UPF-02', 'Chennai UPF 02', 'South', 'Ericsson', 'UPF', 'URLLC-Logistics', 'online', '24.Q1.3', 99.74, '2026-03-12T02:20:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000106', 'PUN-EDGE-04', 'Pune Edge 04', 'West', 'Samsung', 'Edge Site', 'mMTC-Industrial', 'maintenance', '25.1.0', 96.20, '2026-03-12T02:25:00Z', '2026-03-14T08:00:00Z')
on conflict (id) do update
set
  site_code = excluded.site_code,
  name = excluded.name,
  region = excluded.region,
  vendor = excluded.vendor,
  node_type = excluded.node_type,
  network_slice = excluded.network_slice,
  status = excluded.status,
  software_version = excluded.software_version,
  availability_pct = excluded.availability_pct,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.network_metrics (
  id,
  node_id,
  metric_type,
  metric_value,
  unit,
  threshold_value,
  sample_window,
  recorded_at,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'latency_ms', 14.60, 'ms', 20.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'throughput_mbps', 912.00, 'Mbps', 700.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', 'packet_loss_pct', 0.18, '%', 0.80, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000101', 'jitter_ms', 4.20, 'ms', 8.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000102', 'latency_ms', 42.70, 'ms', 20.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102', 'throughput_mbps', 548.00, 'Mbps', 600.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000102', 'packet_loss_pct', 1.34, '%', 1.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000102', 'jitter_ms', 12.50, 'ms', 8.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000103', 'latency_ms', 18.90, 'ms', 30.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000210', '00000000-0000-0000-0000-000000000103', 'throughput_mbps', 320.00, 'Mbps', 250.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000103', 'packet_loss_pct', 0.42, '%', 1.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000103', 'jitter_ms', 6.80, 'ms', 10.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000213', '00000000-0000-0000-0000-000000000104', 'latency_ms', 67.20, 'ms', 25.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000214', '00000000-0000-0000-0000-000000000104', 'throughput_mbps', 118.00, 'Mbps', 450.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000215', '00000000-0000-0000-0000-000000000104', 'packet_loss_pct', 3.80, '%', 1.20, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000216', '00000000-0000-0000-0000-000000000104', 'jitter_ms', 18.60, 'ms', 10.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000217', '00000000-0000-0000-0000-000000000105', 'latency_ms', 11.80, 'ms', 18.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000218', '00000000-0000-0000-0000-000000000105', 'throughput_mbps', 884.00, 'Mbps', 700.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000219', '00000000-0000-0000-0000-000000000105', 'packet_loss_pct', 0.22, '%', 0.80, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000220', '00000000-0000-0000-0000-000000000105', 'jitter_ms', 3.10, 'ms', 7.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000221', '00000000-0000-0000-0000-000000000106', 'latency_ms', 24.50, 'ms', 25.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000222', '00000000-0000-0000-0000-000000000106', 'throughput_mbps', 276.00, 'Mbps', 250.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000223', '00000000-0000-0000-0000-000000000106', 'packet_loss_pct', 0.64, '%', 1.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000224', '00000000-0000-0000-0000-000000000106', 'jitter_ms', 9.70, 'ms', 10.00, '5m', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z', '2026-03-14T08:00:00Z')
on conflict (id) do update
set
  node_id = excluded.node_id,
  metric_type = excluded.metric_type,
  metric_value = excluded.metric_value,
  unit = excluded.unit,
  threshold_value = excluded.threshold_value,
  sample_window = excluded.sample_window,
  recorded_at = excluded.recorded_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.network_alerts (
  id,
  node_id,
  metric_id,
  network_slice,
  severity,
  status,
  metric_type,
  title,
  summary,
  current_value,
  threshold_value,
  triggered_at,
  resolved_at,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000205', 'URLLC-Telemedicine', 'critical', 'open', 'latency_ms', 'URLLC latency breach on Delhi gNodeB 11', 'Delhi gNodeB 11 is sustaining 42.7 ms latency on the telemedicine slice, more than double the 20 ms budget.', 42.70, 20.00, '2026-03-14T08:05:00Z', null, '2026-03-14T08:05:00Z', '2026-03-14T08:05:00Z'),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000208', 'URLLC-Telemedicine', 'warning', 'open', 'jitter_ms', 'Jitter instability on Delhi gNodeB 11', 'Scheduler variance on DEL-GNB-11 pushed jitter to 12.5 ms against an 8 ms stability target.', 12.50, 8.00, '2026-03-14T08:06:00Z', null, '2026-03-14T08:06:00Z', '2026-03-14T08:06:00Z'),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000214', 'eMBB-Consumer', 'critical', 'open', 'throughput_mbps', 'Consumer slice throughput collapse in Mumbai', 'MUM-RAN-09 dropped to 118 Mbps while the consumer slice needs at least 450 Mbps to hold peak evening demand.', 118.00, 450.00, '2026-03-14T08:04:00Z', null, '2026-03-14T08:04:00Z', '2026-03-14T08:04:00Z'),
  ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000215', 'eMBB-Consumer', 'critical', 'open', 'packet_loss_pct', 'Packet loss spike on Mumbai RAN 09', 'Packet loss on the Mumbai consumer slice reached 3.8%, far beyond the 1.2% resilience target.', 3.80, 1.20, '2026-03-14T08:07:00Z', null, '2026-03-14T08:07:00Z', '2026-03-14T08:07:00Z'),
  ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000221', 'mMTC-Industrial', 'info', 'resolved', 'latency_ms', 'Maintenance latency watch on Pune edge site', 'Planned maintenance briefly pushed edge latency near the threshold on PUN-EDGE-04 before traffic was drained successfully.', 24.50, 25.00, '2026-03-13T22:10:00Z', '2026-03-14T00:15:00Z', '2026-03-13T22:10:00Z', '2026-03-14T00:15:00Z')
on conflict (id) do update
set
  node_id = excluded.node_id,
  metric_id = excluded.metric_id,
  network_slice = excluded.network_slice,
  severity = excluded.severity,
  status = excluded.status,
  metric_type = excluded.metric_type,
  title = excluded.title,
  summary = excluded.summary,
  current_value = excluded.current_value,
  threshold_value = excluded.threshold_value,
  triggered_at = excluded.triggered_at,
  resolved_at = excluded.resolved_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.test_cases (
  id,
  slug,
  name,
  category,
  description,
  target_metric,
  pass_threshold,
  pass_condition,
  estimated_duration_seconds,
  is_active,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000401', 'latency-guard', 'End-to-end Latency Guard', 'QoS', 'Measures end-to-end latency against slice-specific service targets.', 'latency_ms', 20.00, 'lte', 420, true, '2026-03-12T03:00:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000402', 'throughput-burst', 'Slice Throughput Burst', 'Capacity', 'Verifies sustained throughput under a short peak-load burst.', 'throughput_mbps', 700.00, 'gte', 600, true, '2026-03-12T03:05:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000403', 'jitter-stability', 'Jitter Stability Probe', 'QoS', 'Checks that scheduler variance stays within jitter tolerance.', 'jitter_ms', 8.00, 'lte', 360, true, '2026-03-12T03:10:00Z', '2026-03-14T08:00:00Z'),
  ('00000000-0000-0000-0000-000000000404', 'packet-loss-recovery', 'Packet Loss Recovery', 'Resilience', 'Validates packet loss recovery after a simulated transport fault.', 'packet_loss_pct', 1.00, 'lte', 480, true, '2026-03-12T03:15:00Z', '2026-03-14T08:00:00Z')
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  target_metric = excluded.target_metric,
  pass_threshold = excluded.pass_threshold,
  pass_condition = excluded.pass_condition,
  estimated_duration_seconds = excluded.estimated_duration_seconds,
  is_active = excluded.is_active,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.test_results (
  id,
  test_case_id,
  node_id,
  status,
  summary,
  observed_value,
  threshold_value,
  details,
  executed_at,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000102', 'fail', 'Latency guard failed on DEL-GNB-11 after recording 42.7 ms on the URLLC telemedicine slice.', 42.70, 20.00, '{"metric_id":"00000000-0000-0000-0000-000000000205","vendor":"Ericsson","slice":"URLLC-Telemedicine"}'::jsonb, '2026-03-14T08:12:00Z', '2026-03-14T08:12:00Z', '2026-03-14T08:12:00Z'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', 'pass', 'Throughput burst passed on BLR-UPF-07 with 912 Mbps sustained throughput.', 912.00, 700.00, '{"metric_id":"00000000-0000-0000-0000-000000000202","vendor":"Nokia","slice":"eMBB-Enterprise"}'::jsonb, '2026-03-14T08:10:00Z', '2026-03-14T08:10:00Z', '2026-03-14T08:10:00Z'),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000104', 'fail', 'Throughput burst failed on MUM-RAN-09 after the offline cluster collapsed to 118 Mbps.', 118.00, 450.00, '{"metric_id":"00000000-0000-0000-0000-000000000214","vendor":"Nokia","slice":"eMBB-Consumer"}'::jsonb, '2026-03-14T08:11:00Z', '2026-03-14T08:11:00Z', '2026-03-14T08:11:00Z'),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000105', 'pass', 'Jitter stability passed on CHN-UPF-02 with a clean 3.1 ms reading.', 3.10, 7.00, '{"metric_id":"00000000-0000-0000-0000-000000000220","vendor":"Ericsson","slice":"URLLC-Logistics"}'::jsonb, '2026-03-14T08:09:00Z', '2026-03-14T08:09:00Z', '2026-03-14T08:09:00Z'),
  ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000104', 'fail', 'Packet loss recovery failed on MUM-RAN-09 because loss stayed at 3.8% after reroute.', 3.80, 1.20, '{"metric_id":"00000000-0000-0000-0000-000000000215","vendor":"Nokia","slice":"eMBB-Consumer"}'::jsonb, '2026-03-14T08:13:00Z', '2026-03-14T08:13:00Z', '2026-03-14T08:13:00Z'),
  ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000105', 'pass', 'Latency guard passed on CHN-UPF-02 with 11.8 ms observed across the logistics slice.', 11.80, 18.00, '{"metric_id":"00000000-0000-0000-0000-000000000217","vendor":"Ericsson","slice":"URLLC-Logistics"}'::jsonb, '2026-03-14T08:08:00Z', '2026-03-14T08:08:00Z', '2026-03-14T08:08:00Z'),
  ('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000102', 'fail', 'Jitter stability failed on DEL-GNB-11 with scheduler variance peaking at 12.5 ms.', 12.50, 8.00, '{"metric_id":"00000000-0000-0000-0000-000000000208","vendor":"Ericsson","slice":"URLLC-Telemedicine"}'::jsonb, '2026-03-14T08:14:00Z', '2026-03-14T08:14:00Z', '2026-03-14T08:14:00Z')
on conflict (id) do update
set
  test_case_id = excluded.test_case_id,
  node_id = excluded.node_id,
  status = excluded.status,
  summary = excluded.summary,
  observed_value = excluded.observed_value,
  threshold_value = excluded.threshold_value,
  details = excluded.details,
  executed_at = excluded.executed_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.analysis_reports (
  id,
  node_id,
  network_slice,
  risk_level,
  title,
  summary,
  likely_causes,
  recommendations,
  source_alert_ids,
  generated_at,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000102', 'URLLC-Telemedicine', 'high', 'Telemedicine slice instability in North region', 'DEL-GNB-11 is degraded with 42.7 ms latency, 12.5 ms jitter, two open alerts, and failed latency and jitter tests on the telemedicine slice.', array['Congested fronthaul path between DEL-GNB-11 and the edge UPF', 'Scheduler imbalance after the latest Ericsson software patch']::text[], array['Rebalance URLLC scheduler queues before the next peak window', 'Inspect the north fronthaul segment and validate transport shaping after remediation']::text[], array['00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000302']::uuid[], '2026-03-14T08:16:00Z', '2026-03-14T08:16:00Z', '2026-03-14T08:16:00Z'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000104', 'eMBB-Consumer', 'critical', 'Mumbai consumer slice outage footprint', 'MUM-RAN-09 is offline with throughput at 118 Mbps, packet loss at 3.8%, two critical open alerts, and repeated failed resilience tests.', array['Backhaul fiber degradation on the west aggregation ring', 'RAN cluster rollback left the consumer sector pinned to a reduced-capacity profile']::text[], array['Dispatch field operations to the west aggregation ring segment', 'Keep consumer traffic pinned to adjacent sectors until throughput returns above 450 Mbps and packet loss falls below 1.2%']::text[], array['00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000304']::uuid[], '2026-03-14T08:17:00Z', '2026-03-14T08:17:00Z', '2026-03-14T08:17:00Z'),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000101', 'eMBB-Enterprise', 'low', 'Bengaluru enterprise slice stable', 'BLR-UPF-07 is holding 912 Mbps throughput with low latency and no active alerts, making it the current benchmark node for enterprise traffic.', array['Current traffic distribution remains balanced across the Bengaluru UPF pair']::text[], array['Use BLR-UPF-07 as the enterprise baseline for future capacity regression checks']::text[], '{}'::uuid[], '2026-03-14T08:18:00Z', '2026-03-14T08:18:00Z', '2026-03-14T08:18:00Z'),
  ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000106', 'mMTC-Industrial', 'medium', 'Pune industrial edge under planned maintenance', 'PUN-EDGE-04 is in maintenance with a resolved latency watch, and its latest metrics remain close to threshold but still explainable by planned work.', array['Traffic drain introduced temporary edge path variance during maintenance', 'Industrial slice sessions were pinned to a reduced redundancy profile']::text[], array['Close the maintenance window only after rerunning latency and jitter checks', 'Keep the maintenance banner visible until the site exits the near-threshold band']::text[], array['00000000-0000-0000-0000-000000000305']::uuid[], '2026-03-14T08:19:00Z', '2026-03-14T08:19:00Z', '2026-03-14T08:19:00Z')
on conflict (id) do update
set
  node_id = excluded.node_id,
  network_slice = excluded.network_slice,
  risk_level = excluded.risk_level,
  title = excluded.title,
  summary = excluded.summary,
  likely_causes = excluded.likely_causes,
  recommendations = excluded.recommendations,
  source_alert_ids = excluded.source_alert_ids,
  generated_at = excluded.generated_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;
