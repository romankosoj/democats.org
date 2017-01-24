---
title: Cryptonote pool blocks | Democats.org
description: 
keywords: 
layout: default
---

<div ng-controller="PoolMiningCtl">

<%= render 'pool-header' %>

<div class="container">
   <noscript></noscript>
   <div class="main-app-container">


      <h5>Connection Details</h5>
      <div class="stats row">
          <div class="col-md-3">Mining Pool Address:</div>
          <div class="col-md-9"><b>stratum+tcp://{{selected_pool.poolmining}}</b></div>
      </div>
      <div class="stats row">
          <div class="col-md-3">nicehash Address:</div>
          <div class="col-md-9"><b>stratum+tcp://{{selected_pool.poolmining.substring(0, selected_pool.poolmining.length - 1)+1}}</b></div>
      </div>
      <div class="row">
         <div class="col-md-12">
<br />
<p>
Add <i>.[difficulty]</i> to the end of your address in mining software configuration to set fixed difficulty for your worker. You can calculate optimal difficulty as: WORKER HASHRATE x 90 SECONDS. So if average hashrate of your miner connection is 100 H/S, than optimal fixed difficulty will be 9000.
</p>
<p>
<span class="muted">Example:</span> <code>minerd -a cryptonight -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS.9000 -p x</code>
</p>
         </div>
      </div>
      <hr>

      <h5>Mining Apps</h5>
      <div class="yourStats table-responsive">
             <table class="table">
                <thead>
                   <tr>
                      <th>Miner</th>
                      <th>Discussion</th>
                      <th>Download</th>
                      <th>Source Code</th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td><b>CPUMiner-Multi</b><span>(</span><span>Windows, Linux, Unix</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=632724" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://ottrbutt.com/cpuminer-multi/" target="_blank">ottrbutt.com</a></td>
                      <td><a href="https://github.com/wolf9466/cpuminer-multi" target="_blank">Github</a></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>minerd -a cryptonight -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>ccminer-cryptonight</b><span>(</span><span>Windows, Linux</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=656841.msg7487737#msg7487737" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://github.com/tsiv/ccminer-cryptonight/releases" target="_blank">Github</a></td>
                      <td><a href="https://github.com/tsiv/ccminer-cryptonight" target="_blank">Github</a></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>ccminer -a cryptonight -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>Claymore CryptoNote GPU</b><span>(</span><span>Windows x64, Linux x64</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=638915.0" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://mega.co.nz/#F!e4JVEAIJ!l1iF4z10fMyJzY5-LnyC2A" target="_blank">mega.co.nz</a></td>
                      <td class="font-grey">Proprietary</td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>NsGpuCNMiner64 -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>Claymore CryptoNote CPU</b><span>(</span><span>Windows</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=647251.0" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://mega.co.nz/#F!Hg4g1bLT!4Upg8GNiEZYCaZ04XVh_yg" target="_blank">mega.co.nz</a></td>
                      <td class="font-grey">Proprietary</td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>NsCpuCNMiner64 -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>Yam</b><span>(</span><span>Windows x64, Linux x64, MacOS x64, FreeBSD x64</span><span>)</span></td>
                      <td><a href="https://twitter.com/yvg1900" target="_blank">Twitter</a></td>
                      <td><a href="https://mega.co.nz/#F!UlkU0RyR!E8n4CFkqVu0WoOnsJnQkSg" target="_blank">mega.co.nz</a></td>
                      <td class="font-grey">Proprietary</td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>yam -c x -M stratum+tcp://WALLET_ADDRESS:x@{{selected_pool.poolmining}}</code></td>
                   </tr>
                </tbody>
             </table>
      </div>


   </div>
</div>

</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>

