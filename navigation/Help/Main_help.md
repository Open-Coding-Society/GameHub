---
layout: post
title: Help Page
description: Main Help Page
permalink: /help
Author: Ian, Zach, Aarush
---

<!-- Help Homepage - Styled with Bootstrap and Pilot Cities-like UI -->

<div class="container my-5">
  <h1 class="display-4 text-center mb-4">Help Center</h1>
  <p class="lead text-center mb-5">Find answers, tutorials, and contact support for your Bioverse experience.</p>

  <div class="row">
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Getting Started</h5>
          <p class="card-text">Learn how to navigate Bioverse Central through Worlds, and modify game positions.</p>
          <a href="{{site.baseurl}}/world_help" class="btn btn-primary">View Guide</a>
        </div>
      </div>
    </div>
  
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Gameplay FAQ</h5>
          <p class="card-text">Answers to common questions about controls, game objectives, and earning points.</p>
          <a href="{{site.baseurl}}/help/gameplay-faq" class="btn btn-primary">View FAQ</a>
        </div>
      </div>
    </div>
  
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Technical Issues</h5>
          <p class="card-text">Having trouble loading? Browser issues? Check here for quick fixes and browser tips.</p>
          <a href="{{site.baseurl}}/help/technical" class="btn btn-primary">Troubleshoot</a>
        </div>
      </div>
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-md-6 mb-4">
      <div class="card h-100 border-info">
        <div class="card-body">
          <h5 class="card-title text-info">Customization Guide</h5>
          <p class="card-text">Step-by-step instructions to unlock and apply new skins in the game.</p>
          <a href="{{site.baseurl}}/help/customization" class="btn btn-outline-info">Open Guide</a>
        </div>
      </div>
    </div>

    <div class="col-md-6 mb-4">
      <div class="card h-100 border-warning">
        <div class="card-body">
          <h5 class="card-title text-warning">Report a Bug</h5>
          <p class="card-text">Noticed something broken or buggy? Let us know and help improve Bioverse.</p>
          <a href="{{site.baseurl}}/help/report" class="btn btn-outline-warning">Submit Report</a>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center mt-5">
    <p class="text-muted">Need more help? Contact us directly at <strong>support@bioverse.com</strong></p>
    <a href="{{site.baseurl}}/contact" class="btn btn-secondary">Contact Support</a>
  </div>
</div>
